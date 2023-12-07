import { css } from '../styled-system/css';
import { styled } from '../styled-system/jsx';

function App() {
    return <styled.div className={css({ fontSize: '2xl', fontWeight: 'bold' })}>Hello 🐼!</styled.div>;
}

export default App;
