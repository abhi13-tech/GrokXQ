"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Code, GitBranch, Zap, ChevronDown, ExternalLink } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useRef } from "react"

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
  hidden: { scale: 0.98, opacity: 0 },
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
    scale: 1.02,
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
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Refs for scroll animations
  const [heroRef, heroInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const [featuresRef, featuresInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const [ctaRef, ctaInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const features = [
    {
      icon: <Code className="h-6 w-6 text-minimal-accent1" />,
      title: "Code Generation",
      description: "Generate high-quality code snippets, functions, and entire components with AI assistance.",
      href: "/code-generation",
    },
    {
      icon: <Zap className="h-6 w-6 text-minimal-accent1" />,
      title: "Debugging",
      description: "Identify and fix bugs quickly with intelligent error analysis and solution recommendations.",
      href: "/tools/debugging",
    },
    {
      icon: <GitBranch className="h-6 w-6 text-minimal-accent1" />,
      title: "Testing",
      description: "Generate comprehensive test suites and identify edge cases for robust application testing.",
      href: "/testing",
    },
    {
      icon: <Code className="h-6 w-6 text-minimal-accent1" />,
      title: "Code Review",
      description: "Get AI-powered reviews and suggestions for your code.",
      href: "/code-review",
    },
  ]

  return (
    <main className="flex-1 overflow-hidden" ref={containerRef}>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative">
        <motion.div
          className="absolute inset-0 bg-minimal-grid"
          style={{
            backgroundSize: "30px 30px",
            y: backgroundY,
            opacity,
          }}
        />
        <motion.div
          className="container px-4 md:px-6 relative z-10"
          ref={heroRef}
          variants={containerVariants}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
        >
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="flex flex-col items-center justify-center space-y-4 w-full max-w-3xl">
              <div className="space-y-2 text-center mx-auto w-full">
                <motion.h1
                  className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none minimal-gradient-text text-center"
                  variants={itemVariants}
                >
                  GrokXQ Development Suite
                </motion.h1>
                <motion.p
                  className="text-minimal-muted-foreground md:text-xl text-center mx-auto mt-4"
                  variants={itemVariants}
                >
                  Streamline your development workflow with our comprehensive AI tools. Generate code, debug issues,
                  test applications, and deploy with confidence.
                </motion.p>
              </div>
              <motion.div
                className="flex flex-col items-center gap-2 min-[400px]:flex-row mt-6"
                variants={itemVariants}
              >
                <Link href="/dashboard">
                  <Button size="lg" className="gap-1.5 group">
                    <span>Get Started</span>
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </Button>
                </Link>
                <Link href="/documentation">
                  <Button size="lg" variant="outline" className="group">
                    View Documentation
                    <motion.span
                      className="ml-1 inline-block"
                      animate={{ y: [0, 3, 0] }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.span>
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}>
            <ChevronDown className="h-6 w-6 text-minimal-accent1" />
          </motion.div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32 relative">
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
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight minimal-gradient-text">
                Comprehensive Development Tools
              </h2>
              <p className="max-w-[900px] text-minimal-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our AI-powered suite provides everything you need to accelerate your development workflow.
              </p>
            </div>
          </motion.div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-12">
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
                <Card className="h-full transition-all duration-200 overflow-hidden border-minimal-accent3/10">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <motion.div whileHover={{ scale: 1.05 }} className="p-2 rounded-md bg-minimal-light/50">
                      {feature.icon}
                    </motion.div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-minimal-muted-foreground">{feature.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Link href={feature.href} className="w-full">
                      <Button variant="ghost" size="sm" className="gap-1 w-full justify-between group">
                        Learn more
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 relative">
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
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight minimal-gradient-text">
                Ready to Transform Your Development Workflow?
              </h2>
              <p className="max-w-[900px] text-minimal-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of developers who are already using our AI-powered suite to build better software,
                faster.
              </p>
            </div>
            <motion.div
              className="flex flex-col gap-2 min-[400px]:flex-row mt-6"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link href="/dashboard">
                <Button size="lg" className="gap-1.5">
                  <span>Get Started Now</span>
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </Button>
              </Link>
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-1.5">
                  <span>View on GitHub</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  )
}
