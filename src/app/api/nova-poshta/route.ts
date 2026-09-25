import { NextRequest, NextResponse } from 'next/server';

const NP_URL = 'https://api.novaposhta.ua/v2.0/json/';
const CITY_LETTERS = 'абвгдеєжзиіїйклмнопрстуфхцчшщьюя'.split('');

type NpRecord = Record<string, string>;

type CityItem = {
  id: string;
  label: string;
  area: string;
};

let cityIndex: CityItem[] | null = null;
let cityIndexAt = 0;

async function callNovaPoshta(calledMethod: string, methodProperties: Record<string, string>) {
  const apiKey = process.env.NOVA_POSHTA_API_KEY;
  if (!apiKey) {
    throw new Error('NOVA_POSHTA_API_KEY is missing');
  }

  const response = await fetch(NP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey,
      modelName: 'Address',
      calledMethod,
      methodProperties,
    }),
    cache: 'no-store',
  });

  const json = (await response.json()) as {
    success?: boolean;
    data?: NpRecord[];
    errors?: string[];
  };

  if (!json.success) {
    throw new Error(json.errors?.[0] || 'Nova Poshta request failed');
  }

  return json.data ?? [];
}

function mapCity(city: NpRecord): CityItem {
  const type = city.SettlementTypeDescription?.trim();
  const name = city.Description?.trim() || '';
  return {
    id: city.Ref,
    label: type ? `${type} ${name}` : name,
    area: city.AreaDescription || '',
  };
}

async function loadCityIndex() {
  if (cityIndex && Date.now() - cityIndexAt < 60 * 60 * 1000) {
    return cityIndex;
  }

  const unique = new Map<string, CityItem>();

  for (let offset = 0; offset < CITY_LETTERS.length; offset += 6) {
    const letters = CITY_LETTERS.slice(offset, offset + 6);
    const batches = await Promise.all(
      letters.map((letter) =>
        callNovaPoshta('getCities', { FindByString: letter, Limit: '80', Page: '1' }).catch(
          () => [] as NpRecord[],
        ),
      ),
    );

    batches.flat().forEach((city) => {
      if (!city.Ref) return;
      unique.set(city.Ref, mapCity(city));
    });
  }

  cityIndex = [...unique.values()].sort((a, b) => a.label.localeCompare(b.label, 'uk'));
  cityIndexAt = Date.now();
  return cityIndex;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const kind = searchParams.get('kind');
  const query = (searchParams.get('q') || '').trim();

  try {
    if (kind === 'cities') {
      if (query) {
        const data = await callNovaPoshta('getCities', {
          FindByString: query,
          Limit: '30',
          Page: '1',
        });
        const items = data
          .map(mapCity)
          .filter((item) => item.id && item.label)
          .sort((a, b) => a.label.localeCompare(b.label, 'uk'));
        return NextResponse.json({ items });
      }

      const items = await loadCityIndex();
      return NextResponse.json({ items });
    }

    if (kind === 'warehouses') {
      const cityRef = searchParams.get('cityRef') || '';
      if (!cityRef) {
        return NextResponse.json({ items: [] });
      }

      const properties: Record<string, string> = {
        CityRef: cityRef,
        Limit: query ? '40' : '100',
        Page: '1',
        Language: 'UA',
      };
      if (query) properties.FindByString = query;

      const data = await callNovaPoshta('getWarehouses', properties);
      const items = data
        .map((warehouse) => ({
          id: warehouse.Ref,
          label: warehouse.Description,
          kind: warehouse.CategoryOfWarehouse || '',
        }))
        .filter((item) => item.id && item.label)
        .sort((a, b) => a.label.localeCompare(b.label, 'uk'));

      return NextResponse.json({ items });
    }

    return NextResponse.json({ error: 'Unknown kind' }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Nova Poshta request failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
