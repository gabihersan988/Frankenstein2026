import { CommunityDirectory } from '../components/Social/CommunityDirectory';

export const CommunityPage = () => {
    return (
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
                    🌐 Comunidad Frankenstein
                </h1>
                <p className="text-sm text-zinc-500 mt-1 max-w-xl">
                    Descubre estudiantes, expertos y empresas. Conéctate con otros creadores, síguelos para convertiros en amigos y envíales mensajes directos.
                </p>
            </div>

            <CommunityDirectory />
        </main>
    );
};
