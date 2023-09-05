
import ContentLoader from 'react-content-loader'

const CardLoaderAsset = (props: any) => (
    <ContentLoader
        speed={2}
        width={730}
        height={62}
        viewBox="0 0 730 62"    
        backgroundColor="#f3f3f3"
        foregroundColor="#6b6b6b"
        {...props}
    >
        <rect x="48" y="10" rx="3" ry="3" width="88" height="6" />
        <rect x="72" y="29" rx="3" ry="3" width="52" height="6" />
        <circle cx="20" cy="20" r="20" />
        <circle cx="57" cy="29" r="9" />
        <rect x="676" y="10" rx="3" ry="3" width="52" height="6" />
        <rect x="676" y="29" rx="3" ry="3" width="52" height="6" />
    </ContentLoader>
)


export default CardLoaderAsset