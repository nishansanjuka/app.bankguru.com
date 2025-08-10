import { Shield, Lock, Eye, UserCheck, Database, Globe } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy - BankGuru",
  description: "Learn how BankGuru protects your privacy and handles your personal information.",
  icons: {
    icon: "/logo/logo.png",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-[#4B4B4B] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Last updated: December 2024
          </p>
        </div>
      </div>

      {/* Privacy Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Introduction */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-orange-500 pb-2">
            Introduction
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            At BankGuru, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our financial comparison platform.
          </p>
          <p className="text-gray-700 leading-relaxed">
            By using our services, you consent to the data practices described in this policy. If you do not agree with our privacy practices, please do not use our website or services.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Database className="w-6 h-6 text-orange-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Name, email address, and contact information</li>
                <li>Financial information (income, credit score range, existing debts)</li>
                <li>Demographic information (age, location, employment status)</li>
                <li>Account credentials and profile preferences</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, clicks and interactions)</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Location data (if you enable location services)</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Third-Party Information</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Information from financial institutions when you apply for products</li>
                <li>Credit reporting agency data (with your consent)</li>
                <li>Social media information (if you connect social accounts)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Information */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <UserCheck className="w-6 h-6 text-orange-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Provision</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Provide personalized product recommendations</li>
                  <li>Process account registration and authentication</li>
                  <li>Enable product comparisons and applications</li>
                  <li>Send service-related communications</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Platform Improvement</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Analyze usage patterns and user behavior</li>
                  <li>Improve our algorithms and recommendations</li>
                  <li>Develop new features and services</li>
                  <li>Conduct research and analytics</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Communication</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Send marketing communications (with consent)</li>
                  <li>Provide customer support</li>
                  <li>Send important updates and notifications</li>
                  <li>Respond to inquiries and feedback</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Compliance</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Comply with legal obligations</li>
                  <li>Prevent fraud and ensure security</li>
                  <li>Enforce our terms of service</li>
                  <li>Protect our rights and property</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Information Sharing */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Globe className="w-6 h-6 text-orange-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Information Sharing</h2>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>We do not sell your personal information.</strong> We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Financial Institutions:</strong> When you choose to apply for products, we share necessary information to process your application</li>
              <li><strong>Service Providers:</strong> With trusted third-party vendors who help us operate our platform</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
              <li><strong>With Your Consent:</strong> Any other sharing will be done only with your explicit permission</li>
            </ul>
          </div>
        </div>

        {/* Data Security */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Lock className="w-6 h-6 text-orange-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Safeguards</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
                <li>256-bit SSL encryption for data transmission</li>
                <li>Encrypted data storage and databases</li>
                <li>Regular security audits and testing</li>
                <li>Secure data centers with physical protection</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Administrative Controls</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm">
                <li>Limited access to personal information</li>
                <li>Employee training on data protection</li>
                <li>Multi-factor authentication requirements</li>
                <li>Regular security policy updates</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Your Rights */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Eye className="w-6 h-6 text-orange-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Your Privacy Rights</h2>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6">
            <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Access:</strong> Request copies of your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Request transfer of your data</li>
              </ul>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Restriction:</strong> Request limitation of processing</li>
                <li><strong>Objection:</strong> Object to certain data processing</li>
                <li><strong>Consent Withdrawal:</strong> Withdraw consent at any time</li>
                <li><strong>Complaint:</strong> File complaints with data protection authorities</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-[#4B4B4B] text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            If you have questions about this Privacy Policy or our data practices, please contact our Data Protection Officer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/contact">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Contact Privacy Team
              </button>
            </Link>
            <Link href="mailto:privacy@bankguru.com">
              <button className="border border-orange-500 text-orange-500 hover:bg-orange-50 hover:text-orange-600 px-8 py-3 rounded-lg font-semibold transition-colors">
                privacy@bankguru.com
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
