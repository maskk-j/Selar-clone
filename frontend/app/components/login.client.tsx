import React, { useState, useTransition } from "react";
import "../styles/auth.scss";
import { Link, redirect, useNavigate } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { loginSchema } from "~/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { AxiosError } from "axios";
import ApiRequest from "~/lib/axios";
import { Loader } from "lucide-react";
import { useCookies } from "react-cookie";
import Cookies from "js-cookie";

const LoginComponent = () => {
   const form = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues: {},
   });
   const navigate = useNavigate();
   const [transition, startTransition] = useTransition();
   const [cookies, setCookie, removeCookie] = useCookies(["authentication"]);

   const isSubmitting = transition;
   async function onSubmit(values: z.infer<typeof loginSchema>) {
      startTransition(async () => {
         try {
            const body = {
               email: values.email,
               password: values.password,
            };
            const { data } = await ApiRequest.post("/authorization/login", body);

            localStorage.setItem("AUTH_USER", data.user.token);
            toast.success(data.status);

            navigate("/me/dashboard");
         } catch (error) {
            if (error instanceof AxiosError) {
               toast.error(error.response?.data.message);
            }
         }
      });
   }

   const [isConsentAgreed, setIsConsentAgreed] = useState(false);

   return (
      <div className="login">
         <div className="login__wrapper">
            <h1>Create your Marketly Account</h1>
            <p className="login__desc">
               Already have an accont? <Link to="/register">Create new account</Link>
            </p>

            {/* Form Section */}
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
               >
                  <FormField
                     control={form.control}
                     name="email"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="form__label">Email Address</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="johndoe@mail.com"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="password"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="form__label">Password</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="**********"
                                 type="password"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <div className="flex gap-3">
                     <Input
                        placeholder="**********"
                        className="size-6 bg-[#5a0b4d]"
                        type="checkbox"
                        onChange={(e) => setIsConsentAgreed(e.target.checked)}
                     />
                     <p className="text-small">
                        Signing up for a Selar account means you agree to our privacy policy and
                        terms & conditions
                     </p>
                  </div>
                  <Button
                     className="w-full"
                     type="submit"
                     disabled={
                        isSubmitting ||
                        !isConsentAgreed ||
                        Object.keys(form.formState.errors).length > 0
                     }
                  >
                     {isSubmitting && (
                        <Loader
                           size="16"
                           className="ml-2"
                        />
                     )}
                     Login
                  </Button>
               </form>
            </Form>
         </div>
      </div>
   );
};

export default LoginComponent;
