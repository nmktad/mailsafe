/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects() {
        return [
            {
                source: '/',
                destination: '/m',
                permanent: false,
            },
        ];
    },
};

export default nextConfig;
