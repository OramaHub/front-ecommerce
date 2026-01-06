import { NavLink } from "react-router";

export function HomePage(){
    return <h1>
        HomePage
        <NavLink to="/carrinho">Carrinho</NavLink>
    </h1>
}
