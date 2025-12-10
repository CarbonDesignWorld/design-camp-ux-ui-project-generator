import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CampfireChat from "@/components/CampfireChat";
import SubmissionsGallery from "@/components/SubmissionsGallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Image } from "lucide-react";

const Community = () => {
  return (
    <>
      <Helmet>
        <title>Campfire Community | Design Camp</title>
        <meta
          name="description"
          content="Join the Design Camp community. Chat with fellow designers and explore submissions from campers around the world."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1">
          {/* Hero */}
          <section className="section-padding bg-secondary/10">
            <div className="container text-center">
              <div className="camp-badge mb-4">
                <Flame className="w-4 h-4" />
                Campfire Community
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4">
                Gather Around the Campfire
              </h1>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                Connect with fellow designers, share your work, and get inspired by the community
              </p>
            </div>
          </section>

          {/* Tabs Section */}
          <section className="section-padding">
            <div className="container">
              <Tabs defaultValue="chat" className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <Flame className="w-4 h-4" />
                    Campfire Chat
                  </TabsTrigger>
                  <TabsTrigger value="submissions" className="flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Latest Submissions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat">
                  <div className="max-w-3xl mx-auto">
                    <div className="camp-card">
                      <CampfireChat />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="submissions">
                  <SubmissionsGallery />
                </TabsContent>
              </Tabs>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Community;
