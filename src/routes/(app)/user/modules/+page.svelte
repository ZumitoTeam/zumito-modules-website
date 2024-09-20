<script lang="ts">
    import { page } from '$app/stores';
    import Breadcrumb from '$lib/components/breadcrumb.svelte';
    import ModulesList from '$lib/components/modules/modulesList.svelte';
    import Background from '$lib/components/structure/background.svelte';
    import Container from '$lib/components/structure/container.svelte';
    import SectionTitle from '$lib/components/structure/section.svelte';
    import { Prisma } from '@prisma/client'

    let modules: Prisma.ModuleSelect[] = $page.data.modules;
</script>

<Background>
    <Container class="flex flex-wrap items-center justify-between pt-4">

        <SectionTitle title="Modules of {$page.data.tokenData.username}">
            <ModulesList modules={modules}></ModulesList>
        </SectionTitle>

        <div class="mt-6 mb-2">
            <Breadcrumb items={[
                {
                    title: "Home",
                    link: '/',
                }, {
                    title: $page.data.tokenData.username,
                    link: '/user/' + $page.data.tokenData.username
                }, {
                    title: 'modules',
                    link: '/user/modules'
                }
            ]} />
        </div>

    </Container>
</Background>  
