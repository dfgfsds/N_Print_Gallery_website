"use client";
import React from "react";
import ReactCompareImage from "react-compare-image";

export default function StandupPouchSection() {
  return (
    <section className="">
      <div className="container bg-gray-200 py-16 md:rounded-xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* Left Content */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Experience the Elegance of <br /> True Print Quality
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            High-quality, <a href="#" className="text-gray-600 underline">digitally printed stand-up zip pouches</a>
            with matte and glossy finishes. Ideal for food, pet food, and industrial packaging.
            Available in multiple sizes and customization options to enhance branding.
          </p>
          <button className="bg-red-600 hover:bg-red-600 text-white px-6 py-3 rounded-md font-medium shadow-md">
            Explore More
          </button>
        </div>

        {/* Right Image Compare */}
        {/* Right Image Compare */}
        <div className="rounded-xl overflow-hidden shadow-lg">
          <ReactCompareImage
            leftImage="https://d3pyarv4eotqu4.cloudfront.net/printongo/images/contentimages/images/after.jpg?v=7439"
            rightImage="https://d3pyarv4eotqu4.cloudfront.net/printongo/images/contentimages/images/066515.jpg?v=7439"

            sliderLineColor="#000"
            sliderPositionPercentage={0.5}
            handle={
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white border-2 border-red-600 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 12H5m0 0l4-4m-4 4l4 4m10-4l-4-4m4 4l-4 4"
                  />
                </svg>

              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}

