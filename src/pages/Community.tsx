import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubmissionsGallery from "@/components/SubmissionsGallery";
import { Image } from "lucide-react";

const Community = () => {
  return (
    <>
      <Helmet>
        <title>Community Submissions | Design Camp</title>
        <meta
          name="description"
          content="Explore submissions from Design Camp campers around the world. Get inspired by the community's creative work."
        />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1">
          {/* Hero */}
          <section className="section-padding bg-secondary/10">
            <div className="container text-center">
              <div className="camp-badge mb-4">
                <Image className="w-4 h-4" />
                Community Gallery
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mt-4">
                Latest Submissions
              </h1>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                Get inspired by the creative work from campers around the world
              </p>
            </div>
          </section>

          {/* Submissions Section */}
          <section className="section-padding">
            <div className="container">
              <SubmissionsGallery />
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Community;
