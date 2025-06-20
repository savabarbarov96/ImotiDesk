import React from "react";
import { Helmet } from "react-helmet";
import CareersList from "@/components/careers/CareersList";
import CareerApplicationForm from "@/components/careers/CareerApplicationForm";
import CompanyCulture from "@/components/careers/CompanyCulture";
import EmployeeTestimonials from "@/components/careers/EmployeeTestimonials";
import CareersFAQ from "@/components/careers/CareersFAQ";
import CareersHero from "@/components/careers/CareersHero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TextShimmer } from '@/components/ui/text-shimmer';

const CareersPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Кариери | Automation Aid</title>
        <meta 
          name="description" 
          content="Станете част от екипа на Automation Aid - кариерни възможности и отворени позиции." 
        />
      </Helmet>
      
      <Navbar />
      
      {/* New Modern Hero Section */}
      <CareersHero />

      <div className="container mx-auto py-12 px-4">
        {/* Company Culture Section with Photo Gallery */}
        <CompanyCulture />

        {/* Employee Testimonials */}        <section className="mb-20 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">          <div className="py-16 px-8">            <div className="text-center mb-12">              <TextShimmer                 as="h2"                className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"                duration={2.5}              >                Нашите служители споделят              </TextShimmer>              <p className="text-lg text-gray-600 max-w-2xl mx-auto">                Чуйте какво казват нашите колеги за работата в Automation Aid и защо избират да развиват кариерата си при нас.              </p>            </div>            <EmployeeTestimonials />          </div>        </section>

        {/* Open Positions */}
        <section id="open-positions" className="mb-20">
          <TextShimmer 
            as="h2"
            className="text-2xl md:text-3xl font-bold mb-8 text-center"
            duration={2.5}
          >
            Отворени позиции
          </TextShimmer>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <CareersList />
          </div>
        </section>

        {/* Apply Form */}
        <section className="mb-20 bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <TextShimmer 
            as="h2"
            className="text-2xl md:text-3xl font-bold mb-8 text-center"
            duration={2.5}
          >
            Кандидатствайте
          </TextShimmer>
          <CareerApplicationForm />
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <TextShimmer 
            as="h2"
            className="text-2xl md:text-3xl font-bold mb-8 text-center"
            duration={2.5}
          >
            Често задавани въпроси
          </TextShimmer>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <CareersFAQ />
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
};

export default CareersPage;
