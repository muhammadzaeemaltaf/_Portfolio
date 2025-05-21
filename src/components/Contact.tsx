"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Heading from "./Heading";
import { AnimatedButton } from "./AnimateButton";
import { FaPaperPlane } from "react-icons/fa6";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const sectionRef = useRef(null);
    const formRef = useRef<HTMLFormElement | null>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        gsap.fromTo(
            sectionRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            }
        );
    }, []);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData(e.currentTarget);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                body: formData,
            });
            if (res) {
                setError(null);
                setSuccess("Message sent successfully!");
                if (formRef.current) {
                    formRef.current.reset();
                }
            } else {
                setError("Error sending message. Please try again later.");
                setSuccess(null);
            }
        } catch (err) {
            setError("Error sending message. Please try again later.");
            setSuccess(null);
        } finally {
            setIsSubmitting(false);
            setSuccess(null);
            setError(null);
        }
    };

    return (
        <section
            id="contact"
            className="mb-20 sm:mb-28 w-[min(100%,38rem)] text-center mx-auto px-5"
            ref={sectionRef}
        >

            <Heading
                heading="Contact Me"
            />

            <p className="text-gray-700 mt-6 dark:text-white/80">
                Contact me directly at{" "}
                <Link
                    className="underline text-blue-500"
                    href="mailto:official.zaeemaltaf@gmail.com"
                >
                    official.zaeemaltaf@gmail.com
                </Link>{" "}
                or through this form.
            </p>

            <form
                className="mt-8 flex flex-col dark:text-black"
                onSubmit={handleSubmit}
                ref={formRef}
            >

                <input
                    className="h-14 px-4 rounded-lg borderBlack dark:bg-gray-800/50 dark:text-gray-50 dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none"
                    name="email"
                    type="email"
                    required
                    maxLength={500}
                    placeholder="Your email"
                />
                <input
                    className="h-14 my-3 px-4 rounded-lg borderBlack dark:bg-gray-800/50 dark:text-gray-50 dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none"
                    name="subject"
                    type="text"
                    required
                    maxLength={500}
                    placeholder="Your subject"
                />
                <textarea
                    className="h-52 mb-3 rounded-lg borderBlack p-4 dark:bg-gray-800/50 dark:text-gray-50 dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none"
                    name="message"
                    placeholder="Your message"
                    required
                    maxLength={5000}
                />
                {error && (
                    <div className="text-red-500 mb-3">{error}</div>
                )}
                {success && (
                    <div className="text-green-500 mb-3">{success}</div>
                )}
                <div className={`block relative w-fit ${isSubmitting ? "cursor-not-allowed" : ""}`}>
                    {isSubmitting && (
                        <div className="absolute z-10 inset-0 flex items-center justify-center cursor-not-allowed"/>
                       
                    )}
                    <AnimatedButton
                        text={isSubmitting ? "Sending..." : "Send"}
                        is_disabled={isSubmitting}
                        bg="text-white !py-6 group"
                        type="submit"
                        icon={
                            <FaPaperPlane className="text-xs opacity-70 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                        }
                    />
                </div>
            </form>
        </section>
    );
}
