
import ContentLoader from 'react-content-loader'

const CardLoaderPosition = (props: any) => (
    <ContentLoader
        speed={2}
        width={730}
        height={62}
        viewBox="0 0 730 62"
        backgroundColor="#f3f3f3"
        foregroundColor="#6b6b6b"
        {...props}
    >
        <circle cx="20" cy="20" r="20" />
        <rect x="676" y="10" rx="3" ry="3" width="52" height="6" />
        <rect x="676" y="29" rx="3" ry="3" width="52" height="6" />
        <rect x="4" y="46" rx="3" ry="3" width="725" height="7" />
    </ContentLoader>
)


export default CardLoaderPosition