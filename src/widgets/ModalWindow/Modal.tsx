
const modal =
  'h-dvh w-dvw bg-white/10 backdrop-blur-sm fixed top-0 left-0 flex items-center justify-center ';

interface IModal {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}
const Modal = ({ active, setActive, children }: IModal) => {
  return (
    <div
      className={`${modal} ${
        active ? ' opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setActive(false)}
    >
      <div
        className={`p-[20px]
  rounded-lg
  bg-white
  w-1/2
  transform
  transition-all
  duration-[400ms]
  ${active ? 'scale-100' : 'scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
