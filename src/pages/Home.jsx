function Home() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center gap-6 sm:gap-8 px-4 py-12 sm:py-16 text-center">
      <img src="/logo.png" alt="Seva Mein" className="w-full max-w-[16rem] sm:max-w-md" />
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white">
        Welcome to <span className="text-brand">Sevame</span>
      </h1>
    </section>
  )
}

export default Home
