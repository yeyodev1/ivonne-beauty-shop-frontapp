<script setup lang="ts">
import { useHome } from '@/composables/useHome'
import { useCatalogTaxonomy } from '@/composables/useCatalog'
import HomeHero from '@/components/home/HomeHero.vue'
import HomePerks from '@/components/home/HomePerks.vue'
import HomeSection from '@/components/home/HomeSection.vue'
import HomeCategories from '@/components/home/HomeCategories.vue'
import HomeBrands from '@/components/home/HomeBrands.vue'
import HomeVisit from '@/components/home/HomeVisit.vue'
import HomeSocial from '@/components/home/HomeSocial.vue'
import ProductRail from '@/components/product/ProductRail.vue'
import ProductGrid from '@/components/catalog/ProductGrid.vue'

const { favorites, arrivals, loading } = useHome()
const { categories, brands, categoriesLoaded } = useCatalogTaxonomy()
</script>

<template>
  <div class="home">
    <HomeHero :products="favorites" />
    <HomePerks />

    <HomeSection
      v-if="!categoriesLoaded || categories.length"
      eyebrow="Explora"
      title="Compra por"
      accent="categoría"
      link="/tienda"
      link-label="Toda la tienda"
    >
      <HomeCategories :categories="categories" :loading="!categoriesLoaded" />
    </HomeSection>

    <HomeSection
      v-if="loading || favorites.length"
      eyebrow="Lo que más se llevan"
      title="Favoritos de"
      accent="la casa"
      link="/tienda"
    >
      <ProductRail :products="favorites" :loading="loading" label="Favoritos de la casa" />
    </HomeSection>

    <HomeSection
      v-if="loading || arrivals.length"
      eyebrow="Recién desempacado"
      title="Recién"
      accent="llegados"
      link="/tienda?orden=new"
      link-label="Ver novedades"
    >
      <ProductGrid :products="arrivals" :loading="loading" :skeletons="4" />
    </HomeSection>

    <HomeBrands :brands="brands" />
    <HomeVisit />
    <HomeSocial />
  </div>
</template>
