export const Button=({onClick}:{onClick:()=>void})=>{

    return  <button onClick={onClick} className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-8 rounded">Play Online </button>
}