import { useNavigate } from 'react-router-dom'
import { Ring, Zigzag } from '../components/Decorations.jsx'

export default function Onboarding() {
  const navigate = useNavigate()

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-primary md:max-w-none md:flex-row">
      <div className="relative min-h-[280px] flex-1 overflow-hidden">
        <Ring className="absolute -top-[46px] -right-[18px]" />
        <Zigzag className="absolute top-[105px] -left-[20px]" />
        <Zigzag className="absolute -right-[16px] bottom-[33px]" />
      </div>

      <section className="flex min-h-[292px] shrink-0 flex-col bg-white px-6 pt-6 pb-[max(2rem,env(safe-area-inset-bottom))] md:w-1/2 md:max-w-[560px] md:justify-center md:px-12 md:py-16 lg:px-16">
        <h1 className="text-2xl/9 font-bold lg:text-4xl/tight">Manage What To Do</h1>
        <p className="mt-4 text-xs/[18px] text-muted lg:text-base/7">
          The best way to manage what you have to do,
          <br />
          don&apos;t forget your plans
        </p>

        <button
          type="button"
          onClick={() => navigate('/home')}
          className="mt-auto h-12 w-full cursor-pointer md:mt-12 bg-primary text-base font-medium text-white transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:bg-primary-dark"
        >
          Get Started
        </button>
      </section>
    </main>
  )
}
