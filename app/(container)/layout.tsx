export default function ContainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto min-h-screen backdrop-blur-[1px] z-10">
      <div className="bg-gray-900/10 px-4">{children}</div>
    </div>
  );
}
