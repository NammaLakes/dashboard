import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves } from 'lucide-react';

const Login = () => {
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(password);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-500 to-blue-900">
      <Card className="w-[350px] shadow-lg rounded-2xl">
      <CardHeader className="text-center">
      <div className="flex justify-center mb-4">
      <Waves className="h-12 w-12 text-blue-500" />
      </div>
      <CardTitle className="text-blue-500 text-2xl">Lake Monitoring System</CardTitle>
      <CardDescription className="text-gray-500">Enter your password to continue</CardDescription>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button type="submit" className="w-full bg-blue-600 text-white py-2 font-xl rounded-lg hover:bg-blue-700 rounded-xl">
        Login
      </Button>
      </form>
      </CardContent>
      </Card>
    </div>
  );
};

export default Login;