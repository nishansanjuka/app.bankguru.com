import { FileText, AlertTriangle, Users, Shield, Scale, Gavel } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service - BankGuru",
  description: "Read BankGuru's terms of service and user agreement for our financial comparison platform.",
  icons: {
    icon: "/logo/logo.png",
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-[#4B4B4B] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Please read these terms carefully before using BankGuru&apos;s financial comparison services.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Last updated: December 2024
          </p>
        </div>
      </div>

      {/* Terms Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        
        {/* Important Notice */}
        <div className="bg-orange-50 border-l-4 border-orange-500 p-6 mb-12 rounded-r-lg">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-orange-500 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Notice</h3>
              <p className="text-gray-700">
                By accessing and using BankGuru&apos;s services, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our platform.
              </p>
            </div>
          </div>
        </div>

        {/* Acceptance of Terms */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-orange-500 pb-2">
            1. Acceptance of Terms
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you and BankGuru Private Limited (&quot;BankGuru,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) regarding your use of the BankGuru website and services.
            </p>
            <p>
              By creating an account, accessing our website, or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
            </p>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after any modifications constitutes acceptance of the updated Terms.
            </p>
          </div>
        </div>

        {/* Description of Services */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Scale className="w-6 h-6 text-orange-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">2. Description of Services</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What We Provide</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Financial product comparison tools and information</li>
                <li>Personalized recommendations based on your profile</li>
                <li>Application facilitation to financial institutions</li>
                <li>Educational content and financial guidance</li>
                <li>Market analysis and rate tracking</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What We Don&apos;t Provide</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Financial advice or investment counseling</li>
                <li>Credit or lending services directly</li>
                <li>Guarantee of loan approval or specific rates</li>
                <li>Legal or tax advice</li>
                <li>Insurance coverage or protection</li>
              </ul>
            </div>
          </div>
        </div>

        {/* User Responsibilities */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Users className="w-6 h-6 text-orange-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">3. User Responsibilities</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Requirements</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Be at least 18 years old</li>
                  <li>Have legal capacity to enter contracts</li>
                  <li>Update information when it changes</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Prohibited Activities</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Providing false or misleading information</li>
                  <li>Creating multiple accounts to circumvent restrictions</li>
                  <li>Attempting to access unauthorized areas</li>
                  <li>Using our services for illegal purposes</li>
                  <li>Interfering with platform security or functionality</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Product Applications */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-orange-500 pb-2">
            4. Financial Product Applications
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              When you apply for financial products through our platform:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You authorize us to share your information with the relevant financial institution</li>
              <li>You acknowledge that approval decisions are made solely by the financial institution</li>
              <li>You understand that applications may result in credit inquiries that could affect your credit score</li>
              <li>You agree to provide additional documentation as requested by financial institutions</li>
              <li>You confirm that all information provided is accurate and complete</li>
            </ul>
            <p className="mt-4 font-semibold">
              We are not responsible for application outcomes, approval decisions, or the terms offered by financial institutions.
            </p>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Shield className="w-6 h-6 text-orange-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">5. Intellectual Property</h2>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="space-y-4 text-gray-700">
              <p>
                All content, features, and functionality on the BankGuru platform, including but not limited to text, graphics, logos, button icons, images, audio clips, data compilations, and software, are the exclusive property of BankGuru or its licensors.
              </p>
              <p>
                You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of our content without our prior written permission.
              </p>
              <p>
                The BankGuru name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of BankGuru or its affiliates.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimers and Limitations */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Gavel className="w-6 h-6 text-orange-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">6. Disclaimers and Limitations</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Disclaimer</h3>
              <p className="text-gray-700 text-sm">
                Our services are provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind. We do not guarantee the accuracy, completeness, or timeliness of any information on our platform. Interest rates, terms, and product availability are subject to change without notice.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Limitation of Liability</h3>
              <p className="text-gray-700 text-sm">
                To the maximum extent permitted by law, BankGuru shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
              </p>
            </div>
          </div>
        </div>

        {/* Termination */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-orange-500 pb-2">
            7. Termination
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              You may terminate your account at any time by contacting us or using the account deletion feature in your profile settings.
            </p>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including but not limited to breach of these Terms.
            </p>
            <p>
              Upon termination, your right to use our services will cease immediately. Provisions that by their nature should survive termination will survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
          </div>
        </div>

        {/* Governing Law */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-orange-500 pb-2">
            8. Governing Law
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700">
              These Terms shall be governed by and construed in accordance with the laws of Sri Lanka, without regard to conflict of law principles. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Colombo, Sri Lanka.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-[#4B4B4B] text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            If you have any questions about these Terms of Service, please contact our legal team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/contact">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Contact Legal Team
              </button>
            </Link>
            <Link href="mailto:legal@bankguru.com">
              <button className="border border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 px-8 py-3 rounded-lg font-semibold transition-colors">
                legal@bankguru.com
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
