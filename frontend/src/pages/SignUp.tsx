import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    // Grab form data and create a JSON object
    const formData = new FormData(event.target as HTMLFormElement);
    const data = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch("http://localhost:3000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set content type as JSON
        },
        body: JSON.stringify(data), // Send the data as JSON string
      });

      if (!response.ok) {
        throw new Error("Sign up failed");
      }

      toast.success("Account created successfully");
    } catch (error) {
      toast.error("Failed to create account");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <motion.div 
        className="lg:p-8"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Join the competitive programming community
            </p>
          </div>
          <form onSubmit={onSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="johndoe"
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="m@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  disabled={isLoading}
                  required
                />
              </div>
              <Button disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </div>
          </form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/user/signin"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
      <motion.div 
        className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-blue-800" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Code2 className="mr-2 h-6 w-6" />
          Codemaster
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Level up your programming skills with challenging problems, competitions, and a supportive community of developers."
            </p>
            <footer className="text-sm">Codemaster Team</footer>
          </blockquote>
        </div>
      </motion.div>
    </div>
  );
}