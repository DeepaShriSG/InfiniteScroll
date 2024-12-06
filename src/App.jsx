import { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  let [data, setData] = useState([]);
  let [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  let loader = useRef(null);

  // Fetch data function
  let getData = async (page) => {
    setLoading(true);
    try {
      let res = await axios.get(`https://jsonplaceholder.typicode.com/comments?_page=${page}&_limit=10`);
      if (res.status === 200) {
        setData((prevData) => [...prevData, ...res.data]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // IntersectionObserver setup
  useEffect(() => {
    const observer = new IntersectionObserver(entries=>{
      if(entries[0].isIntersecting){
        setPage(prevPage => prevPage+1)
      }
    })

    if(loader.current){
      observer.observe(loader.current)
    }
  
    return () => {
      if(loader.current){
        observer.unobserve(loader.current)
      }
    }
  }, [])
  

  useEffect(() => {
    getData(page);
  }, [page]);

  return (
    <div className="container m-3 p-3">
      <h3 className="text-center">Infinite Scroll</h3>
      <div className="row">
        {data.map((item, index) => (
          <div 
            key={index} 
            className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center mb-4 p-3" >
            <div className="card shadow" style={{ maxWidth: "18rem" }}>
              <div className="card-header text-bg-primary">{item.name}</div>
              <div className="card-body">
                <h5 className="card-title">{item.email}</h5>
                <p className="card-text">{item.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
  
      {loading && <div className="text-center">Loading...</div>}
  
      <div ref={loader} style={{ height: "20px" }}></div>
    </div>
  );
  
}

export default App;
