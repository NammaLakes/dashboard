import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';

const Login = () => {
  const { t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang); // Save selected language to localStorage
  };

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
      <CardTitle className="text-blue-500 text-2xl">{t('welcome')}</CardTitle>
      <CardDescription className="text-gray-500">{t('password_phrase')}</CardDescription>
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
      <div className="flex justify-end space-x-2 mt-4">
        <Button onClick={() => changeLanguage('en')} className="text-white rounded-xl">
          English
        </Button>
        <Button onClick={() => changeLanguage('kn')} className="text-white rounded-xl">
          ಕನ್ನಡ
        </Button>
      </div>
      </CardContent>
      </Card>
    </div>
    
    
  );
};

export default Login;