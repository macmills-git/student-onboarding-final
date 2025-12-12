import {
  Users, DollarSign, TrendingUp, Activity,
  UserPlus, ArrowRight, Shield, Zap, BarChart3, CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ugTowerImage from '../assets/images/ug.png';

export const HomePage = () => {
  const { profile } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);

  // Define features based on user role
  const getFeatures = () => {
    const commonFeatures = [
      {
        title: 'Student Registration',
        description: 'Seamlessly onboard new students with our intuitive registration system',
        icon: UserPlus,
        color: 'from-blue-500 to-cyan-500',
        link: '/register'
      },
      {
        title: 'Student Management',
        description: 'Efficiently manage and track all student records in one place',
        icon: Users,
        color: 'from-green-500 to-emerald-500',
        link: '/students'
      }
    ];

    if (profile?.role === 'admin') {
      return [
        ...commonFeatures,
        {
          title: 'Analytics Dashboard',
          description: 'Get real-time insights with comprehensive analytics and reports',
          icon: TrendingUp,
          color: 'from-cyan-500 to-teal-500',
          link: '/dashboard'
        },
        {
          title: 'Payment Tracking',
          description: 'Monitor and manage student payments with ease',
          icon: DollarSign,
          color: 'from-blue-600 to-indigo-600',
          link: '/payments'
        }
      ];
    } else {
      // Clerk only gets common features
      return commonFeatures;
    }
  };

  const features = getFeatures();

  const benefits = [
    { icon: Zap, text: 'Lightning-fast performance' },
    { icon: Shield, text: 'Secure data management' },
    { icon: BarChart3, text: 'Powerful analytics' },
    { icon: Activity, text: 'Real-time updates' },
  ];

  return (
    <div className="animate-fade-in">
      {/* HERO SECTION WITH BACKGROUND IMAGE - FULL VIEWPORT */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden -mt-20 sm:-mt-24 lg:-mt-24" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw' }}>
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
          {/* Lighter Blue Overlay with Color Accents */}
          <div className="absolute inset-0 bg-black/25"></div>
          <div className="absolute inset-0 bg-blue-950/20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700/10 via-blue-900/15 to-cyan-700/10"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-purple-500/3 via-transparent to-pink-500/3"></div>
        </div>

        {/* Content */}
        <div className="relative z-20 text-center text-white px-6 max-w-4xl mx-auto">
          <h1 className="text-[2.2rem] md:text-[3.76rem] lg:text-[3.34rem] font-bold mb-3 leading-tight animate-fade-in-up text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] mt-16 lg:mt-32">
            COMPSSA
          </h1>
          <p className="text-[1.4rem] md:text-[2.51rem] lg:text-[2.28rem] font-semibold mb-2 text-white animate-fade-in-up animation-delay-200 drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]">
            Student Management System
          </p>

          <p className="text-[0.84rem] md:text-[1.31rem] lg:text-[1.14rem] text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto animate-fade-in-up animation-delay-300 drop-shadow-lg">
            {profile?.role === 'clerk'
              ? 'Streamline student registration and management with our intuitive tools designed for efficiency.'
              : 'Empowering excellence through efficient student registration, tracking, and analytics.'
            }
          </p>

          <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-[1.1rem] mb-8 mt-8 md:mt-[3.85rem] justify-center animate-fade-in-up animation-delay-500">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-center gap-1.5 md:gap-[0.55rem] bg-white/20 backdrop-blur-md px-2.5 py-1.5 md:px-[1.375rem] md:py-[0.825rem] rounded-full border border-white/30 whitespace-nowrap">
                  <Icon className="w-[0.825rem] h-[0.825rem] md:w-[1.51rem] md:h-[1.51rem]" />
                  <span className="text-[0.825rem] md:text-[1.21rem] font-medium">{benefit.text}</span>
                </div>
              );
            })}
          </div>


        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center cursor-pointer hover:border-white/70 transition-colors duration-300"
            onClick={() => {
              const nextSection = document.querySelector('.bg-gray-50');
              nextSection?.scrollIntoView({ behavior: 'smooth' });
            }}>
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Rest of the content with proper spacing */}
      <div className="relative bg-gray-50 dark:bg-gray-900 space-y-20 pt-20 pb-0">

        {/* SIMPLE FEATURES SECTION */}
        <div className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20" ref={featuresRef}>
          <div className="max-w-6xl mx-auto">
            {/* Simple Header */}
            <div className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                {profile?.role === 'clerk' ? 'Student Management Made Simple' : 'Everything You Need'}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
                {profile?.role === 'clerk'
                  ? 'Essential tools for efficient student registration and management'
                  : 'Powerful features with enterprise-grade security and performance'
                }
              </p>
            </div>

            {/* Clean Features Grid */}
            <div className={`grid grid-cols-1 ${features.length === 2 ? 'sm:grid-cols-2 max-w-4xl mx-auto' : features.length === 3 ? 'sm:grid-cols-2 md:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16`}>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Link
                    key={feature.title}
                    to={feature.link}
                    className={`group bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* Simple Icon */}
                    <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Simple Action */}
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:gap-2 transition-all duration-300">
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Simple Benefits Row */}
            <div className={`transition-all duration-500 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
                  <div className="group">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-300">
                      <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Easy to Use</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Intuitive interface for all users</p>
                  </div>
                  <div className="group">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-300">
                      <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Secure</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Enterprise-grade security</p>
                  </div>
                  <div className="group">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-300">
                      <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Fast</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Lightning-fast performance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* CTA SECTION */}
        <div className="bg-blue-600 dark:bg-blue-800 py-12 md:py-[6.6rem] px-6 md:px-[3.3rem] text-white text-center shadow-2xl mt-20" style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', width: '100vw' }}>
          <h2 className="text-2xl md:text-[2.75rem] font-bold mb-4 md:mb-[1.65rem]">
            {profile?.role === 'clerk' ? 'Ready to Register Students?' : 'Ready to Get Started?'}
          </h2>
          <p className="text-sm md:text-[1.375rem] text-blue-100 mb-8 md:mb-[3.3rem] max-w-2xl mx-auto">
            {profile?.role === 'clerk'
              ? 'Use our streamlined registration system to quickly onboard new students and manage existing records'
              : 'Join thousands of institutions already using our platform to streamline their student management'
            }
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-[1.65rem]">
            <Link
              to="/register"
              className="group bg-white text-blue-600 px-4 py-2 md:px-[1.65rem] md:py-[0.825rem] rounded-full font-bold text-sm md:text-[1.1rem] hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2"
            >
              {profile?.role === 'clerk' ? 'Register New Student' : 'Register Student Now'}
              <ArrowRight className="w-3 h-3 md:w-[1.1rem] md:h-[1.1rem] group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/students"
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-4 py-2 md:px-[1.65rem] md:py-[0.825rem] rounded-full font-bold text-sm md:text-[1.1rem] hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              {profile?.role === 'clerk' ? 'Manage Students' : 'View All Students'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};