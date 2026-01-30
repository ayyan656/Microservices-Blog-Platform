import { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';

/**
 * NewsletterSignup Component
 * Email subscription section with elegant design
 */
export default function NewsletterSignup() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | success | error

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email) return;

        setStatus('loading');

        // Simulate API call (replace with actual newsletter subscription)
        setTimeout(() => {
            setStatus('success');
            setEmail('');

            // Reset after 3 seconds
            setTimeout(() => setStatus('idle'), 3000);
        }, 1000);
    };

    return (
        <section className="bg-editorial-cream rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-editorial-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-editorial-accent/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative max-w-2xl mx-auto text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-6">
                    <Mail className="w-7 h-7 text-editorial-accent" />
                </div>

                {/* Heading */}
                <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-editorial-text mb-4">
                    Stay in the Loop
                </h2>

                {/* Description */}
                <p className="text-editorial-muted text-lg mb-8 leading-relaxed">
                    Join our newsletter for weekly inspiration on design, lifestyle,
                    and everything in between. No spam, just thoughtful content.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <div className="flex-1 relative">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email address"
                            className="w-full px-5 py-4 rounded-xl bg-white border border-gray-200 text-editorial-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-editorial-accent/30 focus:border-editorial-accent transition-all"
                            disabled={status === 'loading' || status === 'success'}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className={`
                            inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold
                            transition-all duration-300 
                            ${status === 'success'
                                ? 'bg-green-500 text-white'
                                : 'bg-accent text-white hover:bg-[#E63900] hover:-translate-y-0.5 shadow-lg hover:shadow-xl'
                            }
                            disabled:opacity-70 disabled:cursor-not-allowed
                        `}
                    >
                        {status === 'loading' && (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {status === 'success' && (
                            <>
                                <Check className="w-5 h-5" />
                                Subscribed!
                            </>
                        )}
                        {status === 'idle' && (
                            <>
                                Subscribe
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                        {status === 'error' && 'Try Again'}
                    </button>
                </form>

                {/* Privacy note */}
                <p className="text-xs text-editorial-muted mt-4">
                    By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
                </p>
            </div>
        </section>
    );
}
