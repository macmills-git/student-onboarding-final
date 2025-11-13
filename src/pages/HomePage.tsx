import {
  Users, DollarSign, TrendingUp, Activity,
  UserPlus, FileText, ArrowRight, Shield, Zap, BarChart3, CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import ugTowerImage from '../assets/images/ug.png';

export const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isWhyChooseVisible, setIsWhyChooseVisible] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const whyChooseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const whyChooseObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsWhyChooseVisible(true);
        }
      },
      { threshold: 0.6 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    if (whyChooseRef.current) {
      whyChooseObserver.observe(whyChooseRef.current);
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
      if (whyChooseRef.current) {
        whyChooseObserver.unobserve(whyChooseRef.current);
      }
    };
  }, []);

  const features = [
    {
      title: 'Student Registration',
      description: 'Seamlessly onboard new students with our intuitive registration system',
      icon: UserPlus,
      color: 'from-blue-500 to-cyan-500',
      link: '/register'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Get real-time insights with comprehensive analytics and reports',
      icon: TrendingUp,
      color: 'from-cyan-500 to-teal-500',
      link: '/dashboard'
    },
    {
      title: 'Student Management',
      description: 'Efficiently manage and track all student records in one place',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      link: '/students'
    },
    {
      title: 'Payment Tracking',
      description: 'Monitor and manage student payments with ease',
      icon: DollarSign,
      color: 'from-blue-600 to-indigo-600',
      link: '/payments'
    },
  ];

  const benefits = [
    { icon: Zap, text: 'Lightning-fast performance' },
    { icon: Shield, text: 'Secure data management' },
    { icon: BarChart3, text: 'Powerful analytics' },
    { icon: Activity, text: 'Real-time updates' },
  ];

  return (
    <div className="animate-fade-in">
      {/* HERO SECTION WITH BACKGROUND IMAGE */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw', marginTop: '-10rem' }}>
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${ugTowerImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Blue Overlay with Color Accents */}
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 bg-blue-950/40"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700/20 via-blue-900/30 to-cyan-700/20"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/5 via-transparent to-pink-500/5"></div>
        </div>

        {/* Content */}
        <div className="relative z-20 text-center text-white px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight animate-fade-in-up text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]">
            COMPSSA
          </h1>
          <p className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 text-white animate-fade-in-up animation-delay-200 drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]">
            Student Management System
          </p>
          <p className="text-base md:text-lg lg:text-xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto animate-fade-in-up animation-delay-300 drop-shadow-lg">
            Empowering excellence through efficient student registration, tracking, and analytics.
          </p>

          <div className="flex flex-wrap md:flex-nowrap gap-4 mb-10 mt-14 justify-center animate-fade-in-up animation-delay-500">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 md:px-5 md:py-3 rounded-full border border-white/30 whitespace-nowrap">
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base font-medium">{benefit.text}</span>
                </div>
              );
            })}
          </div>


        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Rest of the content with proper spacing */}
      <div className="relative bg-gray-50 dark:bg-gray-900 space-y-20 pt-20 pb-0">

        {/* FEATURES SECTION */}
        <div className="px-4 md:px-6 lg:px-8 pt-16 pb-0" ref={featuresRef}>
          <div className={`text-center mb-20 transition-all duration-700 delay-[600ms] ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
            }`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need for an effective manual registration
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  to={feature.link}
                  className={`group bg-transparent rounded-2xl p-6 transition-all duration-700 border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:scale-105 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-blue-500 font-medium group-hover:gap-2 transition-all duration-300">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* WHY CHOOSE US SECTION */}
        <div className="p-12 md:p-16 py-16 md:py-20 -mt-11" ref={whyChooseRef}>
          <div className={`text-center mb-16 transition-all duration-700 delay-[400ms] ${isWhyChooseVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Built for modern educational institutions with cutting-edge technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className={`text-center transition-all duration-700 ${isWhyChooseVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`} style={{ transitionDelay: '800ms' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Easy to Use</h3>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Intuitive interface designed for users of all technical levels
              </p>
            </div>
            <div className={`text-center transition-all duration-700 ${isWhyChooseVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`} style={{ transitionDelay: '800ms' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Secure & Reliable</h3>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Enterprise-grade security to protect your sensitive data
              </p>
            </div>
            <div className={`text-center transition-all duration-700 ${isWhyChooseVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`} style={{ transitionDelay: '800ms' }}>
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Lightning Fast</h3>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Optimized performance for seamless user experience
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* CTA SECTION */}
      <div className="bg-blue-600 dark:bg-blue-800 py-16 md:py-24 px-8 md:px-12 text-white text-center shadow-2xl mt-20" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw' }}>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
          Join thousands of institutions already using our platform to streamline their student management
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            to="/register"
            className="group bg-white text-blue-600 px-6 py-3 rounded-full font-bold text-base hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2"
          >
            Register Student Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/students"
            className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-6 py-3 rounded-full font-bold text-base hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            View All Students
          </Link>
        </div>
      </div>
    </div>
  );
};