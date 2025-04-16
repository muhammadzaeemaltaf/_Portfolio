"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Heading from "./Heading";
import { AnimatedButton } from "./AnimateButton";
import SubmitBtn from "./SubmitBtn";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
    const sectionRef = useRef(null);

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
                action={async (formData) => {
                    const res = await fetch("/api/contact", {
                        method: "POST",
                        body: formData,
                    });
                    if (res.status === 200) {
                        console.log("Message sent successfully!");
                    } else {
                        console.log("Error sending message. Please try again later.");
                    }
                }}
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
                <AnimatedButton
                    text="Submit"
                    bg="text-white"
                    type="submit"
                />
                {/* <SubmitBtn /> */}
            </form>
        </section>
    );
}
