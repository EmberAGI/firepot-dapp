
import ContentLoader from 'react-content-loader'

const CardLoaderDiscovery = (props: any) => (
    <ContentLoader
        speed={2}
        width={368}
        height={146}
        viewBox="-15 0 368 146"
        backgroundColor="#f3f3f3"
        foregroundColor="#6b6b6b"
        {...props}
    >
        <rect x="3" y="23" rx="3" ry="3" width="334" height="6" />
        <rect x="19" y="11" rx="3" ry="3" width="300" height="6" />
        <circle cx="165" cy="70" r="30" />
        <rect x="3" y="114" rx="3" ry="3" width="334" height="13" />
    </ContentLoader>
)


export default CardLoaderDiscovery