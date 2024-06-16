import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Bot, HashIcon, SkullIcon } from "lucide-react";

export default function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-[#f5d0fe] to-[#e879f9] dark:from-[#1e293b] dark:to-[#4c1d95]">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="inline-block rounded-lg bg-pink-100 px-3 py-1 text-sm font-medium text-pink-500 dark:bg-purple-800 dark:text-purple-400">
                AI-Powered Recommendations
              </div>
              <h2 className="text-3xl font-bold tracking-tighter text-gray-900 dark:text-gray-50 sm:text-4xl">
                Unlock your skin and hair&apos;s potential
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-400">
                Our advanced AI analyzes your unique skin and hair concerns to
                provide personalized product recommendations and routines.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <Card className="text-left">
                  <CardHeader>
                    <SkullIcon className="h-8 w-8 text-pink-500 dark:text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                      Skin Analysis
                    </h3>
                    <p className="text-gray-700 dark:text-gray-400">
                      Our AI examines your skin type, texture, and concerns to
                      recommend the best products and routines.
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-left">
                  <CardHeader>
                    <HashIcon className="h-8 w-8 text-pink-500 dark:text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                      Hair Analysis
                    </h3>
                    <p className="text-gray-700 dark:text-gray-400">
                      Our AI evaluates your hair type, condition, and concerns
                      to suggest the perfect haircare products.
                    </p>
                  </CardContent>
                </Card>
                <Card className="text-left">
                  <CardHeader>
                    <Bot className="h-8 w-8 text-pink-500 dark:text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                    AI-Powered Chatbot
                    </h3>
                    <p className="text-gray-700 dark:text-gray-400">
                    Our advanced AI technology allows you to have natural conversations and receive tailored recommendations for your skin and hair concerns.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
  )
}
