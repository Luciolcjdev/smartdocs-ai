import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SignInForm from "./components/signin-form";
import SignUpForm from "./components/signup-form";

const AuthenticationPage = async () => {
  return (
    <div className="h-screen w-screen items-center justify-center space-y-16 bg-linear-to-br from-teal-900/90 via-blue-900/85 to-slate-900/90">
      <div className="flex items-center justify-center pt-16">
        <Image src="/logo-branca.png" alt="Logo SmartDocs Ai" width={350} height={250} />
      </div>
      <div className="flex items-center justify-center">
        <Tabs defaultValue="login" className="w-100 shadow-2xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Criar conta</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <SignInForm />
          </TabsContent>
          <TabsContent value="register">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthenticationPage;
