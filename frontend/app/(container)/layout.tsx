export default function ContainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto min-h-screen backdrop-blur-[1px] z-10">
      <div className="bg-white/5 px-4 my-8 rounded-sm">{children}</div>
    </div>
  );
}
