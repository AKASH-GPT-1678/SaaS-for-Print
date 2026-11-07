import DashboardSidebar from "../components/DashboardSidebar";

const Page = () => {
  return (
    <div className="flex min-h-screen bg-[#eef3ed]">
      <DashboardSidebar />
      <main className="min-w-0 flex-1" aria-label="Dashboard content" />
    </div>
  );
};

export default Page;
