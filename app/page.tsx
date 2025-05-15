"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Code, GitBranch, Rocket, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useEffect, useState } from "react"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
}

const featureCardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.98,
  },
}

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Refs for scroll animations
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [responsiveRef, responsiveInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [ctaRef, ctaInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const calculateMouseDistance = (elementX: number, elementY: number) => {
    const dx = mousePosition.x - elementX
    const dy = mousePosition.y - elementY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const features = [
    {
      icon: <Code className="h-8 w-8 text-primary" />,
      title: "Code Generation",
      description: "Generate high-quality code snippets, functions, and entire components with AI assistance.",
      href: "/code-generation",
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Debugging",
      description: "Identify and fix bugs quickly with intelligent error analysis and solution recommendations.",
      href: "/tools/debugging",
    },
    {
      icon: <GitBranch className="h-8 w-8 text-primary" />,
      title: "Testing",
      description: "Generate comprehensive test suites and identify edge cases for robust application testing.",
      href: "/testing",
    },
    {
      icon: <Rocket className="h-8 w-8 text-primary" />,
      title: "Deployment",
      description: "Streamline your deployment process with automated workflows and best practice recommendations.",
      href: "/deployment",
    },
  ]

  return (
    <main className="flex-1 overflow-hidden">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative">
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background pointer-events-none"
          style={{
            backgroundSize: "400% 400%",
            backgroundPosition: `${(mousePosition.x / window.innerWidth) * 100}% ${(mousePosition.y / window.innerHeight) * 100}%`,
          }}
        />
        <motion.div
          className="container px-4 md:px-6 relative z-10"
          ref={heroRef}
          variants={containerVariants}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <motion.h1
                  className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
                  variants={itemVariants}
                >
                  GrokXQ Development Suite
                </motion.h1>
                <motion.p className="max-w-[600px] text-muted-foreground md:text-xl" variants={itemVariants}>
                  Streamline your development workflow with our comprehensive AI tools. Generate code, debug issues,
                  test applications, and deploy with confidence.
                </motion.p>
              </div>
              <motion.div className="flex flex-col gap-2 min-[400px]:flex-row" variants={itemVariants}>
                <Link href="/dashboard">
                  <Button size="lg" className="gap-1.5 group relative overflow-hidden">
                    <span className="relative z-10">Get Started</span>
                    <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <span className="absolute inset-0 bg-primary-foreground/10 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="group">
                    Explore Features
                    <span className="ml-1 inline-block transition-transform group-hover:translate-y-1">↓</span>
                  </Button>
                </Link>
              </motion.div>
            </div>
            <motion.div
              className="hidden lg:block"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <img
                src="/placeholder-au7ie.png"
                alt="Developer using AI tools"
                width={600}
                height={500}
                className="rounded-xl object-cover w-full aspect-video shadow-lg"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40 relative">
        <div
          className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"
          style={{ backgroundSize: "30px 30px" }}
        />
        <motion.div
          className="container px-4 md:px-6 relative z-10"
          ref={featuresRef}
          variants={containerVariants}
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
        >
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            variants={itemVariants}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Comprehensive Development Tools</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our AI-powered suite provides everything you need to accelerate your development workflow.
              </p>
            </div>
          </motion.div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={featureCardVariants}
                initial="hidden"
                animate={featuresInView ? "visible" : "hidden"}
                whileHover="hover"
                whileTap="tap"
                transition={{ delay: index * 0.1 }}
                custom={index}
              >
                <Card className="h-full transition-all duration-200 overflow-hidden border-transparent hover:border-primary/20">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Link href={feature.href} className="w-full">
                      <Button variant="ghost" size="sm" className="gap-1 w-full justify-between group">
                        Learn more
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 overflow-hidden">
        <motion.div
          className="container px-4 md:px-6"
          ref={responsiveRef}
          variants={containerVariants}
          initial="hidden"
          animate={responsiveInView ? "visible" : "hidden"}
        >
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <motion.div className="flex flex-col justify-center space-y-4" variants={itemVariants}>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Responsive Design for All Devices
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our development suite is designed to work seamlessly across all devices, from desktop to mobile,
                  ensuring a consistent experience no matter where you work.
                </p>
              </div>
              <ul className="grid gap-2">
                {[
                  "Adaptive layouts for any screen size",
                  "Touch-friendly interface for mobile devices",
                  "Optimized performance on all platforms",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center gap-2"
                    variants={itemVariants}
                    custom={index}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10"
                      whileHover={{ scale: 1.2, backgroundColor: "rgba(var(--primary), 0.2)" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </motion.div>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <motion.div className="flex items-center justify-center" variants={itemVariants}>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-4">
                  <motion.img
                    src="/placeholder-a5eg7.png"
                    alt="Desktop interface"
                    width={200}
                    height={200}
                    className="rounded-lg object-cover shadow-lg"
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  />
                  <motion.img
                    src="/tablet-app-interface.png"
                    alt="Tablet interface"
                    width={200}
                    height={200}
                    className="rounded-lg object-cover shadow-lg"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  />
                </div>
                <motion.div
                  className="flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <img
                    src="/mobile-app-interface.png"
                    alt="Mobile interface"
                    width={200}
                    height={420}
                    className="rounded-lg object-cover shadow-lg"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none h-32 bottom-0" />
        <motion.div
          className="container px-4 md:px-6 relative z-10"
          ref={ctaRef}
          variants={containerVariants}
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
        >
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            variants={itemVariants}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Transform Your Development Workflow with GrokXQ?
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of developers who are already using our AI-powered suite to build better software,
                faster.
              </p>
            </div>
            <motion.div
              className="flex flex-col gap-2 min-[400px]:flex-row"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link href="/dashboard">
                <Button size="lg" className="gap-1.5 relative overflow-hidden group">
                  <span className="relative z-10">Get Started Now</span>
                  <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <span className="absolute inset-0 bg-primary-foreground/10 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  )
}
