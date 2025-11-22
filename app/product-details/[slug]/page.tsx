import React from 'react';
import { fetchProductDetails, ProductDetails as ApiProductDetails, Review as ApiReview } from '../../libs/api';
import { Metadata } from 'next';
import ProductDetailsClient from './product-details-client';
import ProductDetailsWrapper from './page-wrapper';
import SevenMukhiLanding from '@/app/mukhi/seven-mukhi-landing';

// Helper function for metadata, can be co-located or moved to a utils file
const getImageUrl = (image: string | undefined, baseUrl: string = 'https://www.pashupatinathrudraksh.com'): string => {
  if (!image) return '/placeholder-product.jpg';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/storage/')) return `${baseUrl}${image}`;
  if (image.startsWith('/')) return `${baseUrl}${image}`;
  if (image.includes(',')) {
    const firstImage = image.split(',')[0].trim();
    return getImageUrl(firstImage, baseUrl);
  }
  return `${baseUrl}/${image}`;
};

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;

  try {
    const response = await fetchProductDetails(slug);

    let productData: ApiProductDetails | null = null;

    if (response) {
      const respAny = response as any;
      if (respAny.data?.product) {
        productData = respAny.data.product;
      } else if (respAny.product_detail) {
        productData = respAny.product_detail;
      } else if (respAny.data?.product_detail) {
        productData = respAny.data.product_detail;
      } else if (respAny) {
        productData = respAny;
      }
    }

    if (!productData) {
      return {
        title: 'Product Not Found',
        description: 'The product you are looking for does not exist.',
      };
    }

    const title = `${productData.title} | Pashupatinath Rudraksh`;
    const description = productData.summary || productData.description || 'Buy 100% Original Certified Rudraksha beads, malas, bracelets, and spiritual accessories sourced from Nepal. Trusted quality with lab certification and worldwide delivery.';
    const imageUrl = getImageUrl(productData.photo?.split(',')[0]?.trim());

    const hasDiscount = productData.discount > 0;
    const currentPrice = hasDiscount
      ? Math.round(productData.price - (productData.price * productData.discount) / 100)
      : productData.price;

    return {
      title,
      description,
      keywords: [productData.title, productData.cat_info?.title || 'Rudraksha', 'Original Rudraksha', 'Certified Rudraksha', 'Pashupatinath Rudraksh'],
      alternates: {
        canonical: `https://www.pashupatinathrudraksh.com/product-details/${slug}`,
      },
      openGraph: {
        title,
        description,
        url: `https://www.pashupatinathrudraksh.com/product-details/${slug}`,
        type: 'website',
        product: {
          price: {
            amount: currentPrice.toString(),
            currency: 'INR',
          },
          availability: productData.stock > 0 ? 'in stock' : 'out of stock',
        },
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: productData.title,
          },
        ],
        siteName: 'Pashupatinath Rudraksh',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
      description: 'An error occurred while generating the page.',
    };
  }
}

// Main Product Details Component
export default async function ProductDetailsPage({ params, searchParams }: Props) {
  const slug = params.slug;
  let productData: ApiProductDetails | null = null;

  if (slug === '7-mukhi-pashupatinath-rudraksh') {
    return <SevenMukhiLanding />;
  }

  let reviewsData: ApiReview[] = [];
  let relatedData: any[] = [];

  try {
    const response = await fetchProductDetails(slug);
    if (response) {
      const respAny = response as any;
      if (respAny.data?.product) {
        productData = respAny.data.product;
        reviewsData = respAny.data.product.get_review || [];
        relatedData = respAny.data.related_products || [];
      } else if (respAny.product_detail) {
        productData = respAny.product_detail;
        reviewsData = respAny.product_detail.get_review || [];
        relatedData = respAny.product_detail.rel_prods || [];
      } else if (respAny.data?.product_detail) {
        productData = respAny.data.product_detail;
        reviewsData = respAny.data.product_detail.get_review || [];
        relatedData = respAny.data.related_products || [];
      } else if (respAny) {
        productData = respAny;
        reviewsData = respAny.get_review || [];
        relatedData = respAny.rel_prods || [];
      }
    }
  } catch (error) {
    console.error("Failed to fetch product details on server:", error);
  }

  return (
    <ProductDetailsWrapper>
      <ProductDetailsClient 
        product={productData} 
        reviews={reviewsData} 
        relatedProducts={relatedData} 
      />
    </ProductDetailsWrapper>
  );
}