
import { ActionFunctionArgs, LinksFunction } from '@remix-run/node';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PlateCustomizer } from '../components/visualizer/doubleAS';
import { getGoogleFontLink } from '../components/visualizer/utils/font_selectors';


export const links: LinksFunction = () => {
    return [
        { rel: 'stylesheet', href: getGoogleFontLink() },
    ];
}

export default function TestPage() {
    return (
        <div className="container">
            <h1>Test Page</h1>
            <PlateCustomizer />
        </div>
    );
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const data = new URLSearchParams(await request.text());

    console.log('happy');

    console.log(data);

    const itemOptions = {
        text_top: data.get('text_top') || '',
        text_bottom: data.get('text_bottom') || '',
        primary_color: data.get('primary_color') || '',
        base_color: data.get('base_color') || '',
        font_top: data.get('font_top') || '',
        font_bottom: data.get('font_bottom') || ''
    };

    return new Response(JSON.stringify({ itemOptions }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
};