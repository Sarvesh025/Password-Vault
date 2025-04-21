import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Lock, Shield, Key, CheckCircle, Fingerprint, RefreshCw } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-16 items-center px-4 sm:px-8">
          <div className="flex items-center gap-2 font-semibold">
            <Lock className="h-5 w-5 text-primary" />
            <span>SecureVault</span>
          </div>
          <div className="ml-auto flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-muted/30">
          <div className="container grid items-center gap-6 pb-12 pt-16 md:grid-cols-2 md:py-20">
            <div className="flex flex-col gap-4">
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                Secure Password Management
              </div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
                Remember just one password. <br className="hidden sm:inline" />
                <span className="text-primary">Secure all the others.</span>
              </h1>
              <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
                Store, generate, and manage all your passwords with a single master key. Your data stays encrypted and
                secure.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/register">
                  <Button size="lg" className="gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-primary/10 blur-3xl"></div>
                <div className="absolute -bottom-8 -right-8 h-72 w-72 rounded-full bg-primary/10 blur-3xl"></div>
                <div className="relative rounded-xl border bg-card p-6 shadow-xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Lock className="h-5 w-5 text-primary" />
                        </div>
                        <h3 className="font-semibold">Password Vault</h3>
                      </div>
                      <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Secure
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded-md border bg-background p-3">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-blue-100 p-1 dark:bg-blue-900/30">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-blue-600 dark:text-blue-400"
                            >
                              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                          </div>
                          <span>Facebook</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs">••••••••••</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                            </svg>
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between rounded-md border bg-background p-3">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-red-100 p-1 dark:bg-red-900/30">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-red-600 dark:text-red-400"
                            >
                              <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                              <path d="m10 15 5-3-5-3z"></path>
                            </svg>
                          </div>
                          <span>YouTube</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs">••••••••••</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                            </svg>
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between rounded-md border bg-background p-3">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-green-100 p-1 dark:bg-green-900/30">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-green-600 dark:text-green-400"
                            >
                              <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                              <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                          </div>
                          <span>Spotify</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs">••••••••••</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-16">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">Key Features</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground">
              Everything you need to keep your passwords secure and accessible
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-primary/10 p-3">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">One Master Password</h3>
              <p className="text-muted-foreground">Remember just one strong password to access all your credentials</p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-primary/10 p-3">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">End-to-End Encryption</h3>
              <p className="text-muted-foreground">Your passwords are encrypted before they leave your device</p>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center shadow-sm transition-all hover:shadow-md">
              <div className="rounded-full bg-primary/10 p-3">
                <Key className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Password Generator</h3>
              <p className="text-muted-foreground">Create strong, unique passwords with our built-in generator</p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-muted/30 py-16">
          <div className="container">
            <div className="mb-12 text-center">
              <h2 className="mb-2 text-3xl font-bold md:text-4xl">Why Choose SecureVault?</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground">
                Our password manager offers the best combination of security, convenience, and features
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Cross-Platform</h3>
                <p className="text-sm text-muted-foreground">Access your passwords on all your devices</p>
              </div>
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Fingerprint className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Biometric Authentication</h3>
                <p className="text-sm text-muted-foreground">Unlock with fingerprint or face recognition</p>
              </div>
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Auto-Fill</h3>
                <p className="text-sm text-muted-foreground">Automatically fill login forms on websites</p>
              </div>
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-medium">Security Alerts</h3>
                <p className="text-sm text-muted-foreground">Get notified about compromised passwords</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-16">
          <div className="rounded-xl bg-primary/10 p-8 text-center md:p-12">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to secure your passwords?</h2>
            <p className="mx-auto mb-6 max-w-[600px] text-muted-foreground">
              Join thousands of users who trust SecureVault to protect their digital life. Get started for free today.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Create Free Account <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 font-semibold">
            <Lock className="h-5 w-5 text-primary" />
            <span>SecureVault</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SecureVault. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

