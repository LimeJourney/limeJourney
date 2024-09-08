export default function Loading() {
  return (
    <>
      <div className="w-50 h-3 bg-meadow-500 rounded-full transform -rotate-15 animate-bar">
        <div className="relative w-[50px] h-[50px] bg-white rounded-full -bottom-[38px] animate-ball">
          <div className="absolute w-[5px] h-[5px] bg-black rounded-full top-[25px] right-[5px]"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes up-down6123 {
          from {
            transform: rotate(-15deg);
          }
          to {
            transform: rotate(15deg);
          }
        }

        @keyframes ball-move8234 {
          from {
            left: calc(100% - 40px);
            transform: rotate(360deg);
          }
          to {
            left: calc(0% - 20px);
            transform: rotate(0deg);
          }
        }

        :global(.animate-bar) {
          animation: up-down6123 3s ease-in-out 1s infinite alternate;
        }

        :global(.animate-ball) {
          position: relative;
          bottom: 50px;
          left: calc(100% - 20px);
          animation: ball-move8234 3s ease-in-out 1s infinite alternate;
        }
      `}</style>
    </>
  );
}
