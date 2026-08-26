
import CanceledDelivery from '@/data/MyOrders_json/CanceledDelivery.json';
import statusCancelDeliveryImg from '@/../public/images/MyOrders/Canceled/Canceled.png';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';


const Canceled = () => {
  const order = CanceledDelivery;
  return (
    <div>
      {order.map((item) => (
        <div key={item.id} className={'border border-[#000000] rounded-lg mb-12'}>
          <p className={'p-3'}>Order ID</p>
          <div className={'flex justify-between items-center px-3'}>
            <div className={'flex gap-2'}>
              <ShoppingBagOutlinedIcon />
              <p className={'text-base '}>TTN {item.id}</p>
            </div>
            <div className={'flex flex-row gap-7 h-7.5'}>
              <p>Estimated delivery date {item.date}</p>
              <img src={statusCancelDeliveryImg.src} alt="" />
            </div>
          </div>
          <div className={'flex justify-between px-5 pt-5'}>
            <div className={'flex gap-2'}>
              <LocalShippingOutlinedIcon />
              <p>{item.address}</p>
            </div>
            <div className={'flex'}>
              <PlaceOutlinedIcon />
              <p>{item.street}</p>
            </div>
          </div>
          {item.order.map((item) => (
            <div key={item.image.length} className={'flex  border rounded-lg mx-5 my-10 py-5 '}>
              <div>
                <img className={'h-60 w-45'} src={item.image} alt="" />
              </div>
              <div className={'flex-1 mx-3 px-3'}>
                <p className={'my-3.5 font-semibold'}>{item.name}</p>
                <p className={'my-3.5'}>{item.title}</p>
                <p className={'my-3.5 opacity-40'}>{item.code}</p>
                <p className={'my-3.5 font-semibold'}>{item.size}</p>
                <div className={'flex justify-between '}>
                  <p className={'text-lg font-light'}>{item.price}</p>
                  <p className={'border rounded-lg px-6 py-2'}>{item.count}</p>
                </div>
              </div>
            </div>
          ))}
          <div className={'flex justify-between px-4 bg-[#F7F7F6] rounded-lg'}>
            <p className={'text-lg font-bold '}>Total: $305</p>
            <div>
              <button className={'border rounded-lg p-2 text-white bg-black w-25 mx-3'}>
                Reorder
              </button>
              <button className={'border rounded-lg p-2 w-25'}>Details</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Canceled;
