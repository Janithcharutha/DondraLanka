import Image from "next/image"

export default function AboutPage() {
  return (
    <div>
      {/* Top Banner Image */}
      <div className="w-full">
        <Image
          src="/adout.jpeg"
          alt="About Us Banner"
          width={1920}
          height={600}
          className="w-full h-auto"
          priority
        />
      </div>

      {/* About Us Section */}
      <section className="bg-[#f9f7f6] py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h4 className="text-sm uppercase tracking-wider text-gray-600 mb-2">About Us</h4>
            <hr className="w-8 border-gray-400 mb-6" />
            <h2 className="font-playfair text-4xl md:text-5xl leading-snug text-gray-900">
              Experience the True Taste of Premium Dried Seafood.
            </h2>
          </div>
          <div>
            <p className="text-gray-700 text-lg leading-relaxed">
              DONDRA LANKA was founded with a clear mission: to deliver the freshest, highest-quality dried fish, seafood, and hygienic food products across worldwide at an affordable price. What began as a small family business has grown into a trusted name in premium dried fish delivery.

Our dedication to sustainability, hygiene, and quality combined with convenient worldwide delivery makes us the top choice for dried fish lovers who value freshness and responsible sourcing.
            </p>
          </div>
        </div>
      </section>

      {/* Our Philosophy Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="/about1.png"
              alt="Herbal Ingredients on a Brass Plate"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <h4 className="text-sm uppercase tracking-wider text-gray-600 mb-2">Our Philosophy</h4>
            <hr className="w-8 border-gray-400 mb-6" />
            <h2 className="font-playfair text-3xl md:text-4xl leading-snug text-gray-900 mb-6">
              Quality, Freshness & Trust in Every Catch
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              At DONDRA LANKA, we believe great food begins with quality and care. Our dried fish and seafood reflect our commitment to freshness, hygiene, and responsible sourcing. Every product is carefully selected, processed, and handled to preserve its natural taste and nutritional value.

We follow strict quality standards to ensure that what reaches your table is safe, clean, and full of authentic flavor. Our philosophy is simple: deliver products we would proudly serve to our own families.</p>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="bg-[#f9f7f6] py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
          <div>
            <h4 className="text-sm uppercase tracking-wider text-gray-600 mb-2">Our Vision</h4>
            <hr className="w-8 border-gray-400 mb-6" />
            <p className="text-gray-700 text-lg leading-relaxed">
              To become a trusted global name in premium dried fish and seafood, known for quality, consistency, and responsible sourcing. We aim to bring the authentic taste of Sri Lanka to customers worldwide while maintaining the highest standards in food safety and sustainability.
            </p>
          </div>
          <div>
            <h4 className="text-sm uppercase tracking-wider text-gray-600 mb-2">Our Mission</h4>
            <hr className="w-8 border-gray-400 mb-6" />
            <p className="text-gray-700 text-lg leading-relaxed">
              Our mission is to deliver high-quality dried fish and seafood that meet international standards of freshness and hygiene. We focus on careful sourcing from trusted suppliers, maintaining strict processing standards, and offering products at affordable prices without compromising quality. With reliable worldwide delivery and a strong commitment to consistency, we aim to build long-term trust by ensuring every product meets customer expectations. </p>
          </div>
        </div>
      </section>
    </div>
  );
}
