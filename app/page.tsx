import MainPageBlocks from "@/components/MainPageBlocks";
import MainPageSpline from "@/components/MainPageSpline";

const MainPage = () => {
  return (
    <div className="flex flex-col">
      <MainPageSpline />
      <MainPageBlocks />
    </div>
  );
};

export default MainPage;
