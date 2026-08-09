import BenefitsSection from '../sections/BenefitsSection/BenefitsSection';
import BestSellersSection from '../sections/BestSellersSection/BestSellersSection';
import CampaignBannerSection from '../sections/CampaignBannerSection/CampaignBannerSection';
import EyewearSection from '../sections/EyewearSection/EyewearSection';
import FeaturedFramesSection from '../sections/FeaturedFramesSection/FeaturedFramesSection';
import HeroSection from '../sections/HeroSection/HeroSection';
import PressMediaSection from '../sections/PressMediaSection/PressMediaSection';
import PromoDuoSection from '../sections/PromoDuoSection/PromoDuoSection';
import ShopBySection from '../sections/ShopBySection/ShopBySection';
import WearlySection from '../sections/WearlySection/WearlySection';

export default function LandingPage() {
  return (
    <div className="pb-10">
      <HeroSection />
      <BestSellersSection />
      <ShopBySection />
      <FeaturedFramesSection />
      <WearlySection />
      <PromoDuoSection />
      <BenefitsSection />
      <CampaignBannerSection />
      <EyewearSection />
      <PressMediaSection />
    </div>
  );
}
