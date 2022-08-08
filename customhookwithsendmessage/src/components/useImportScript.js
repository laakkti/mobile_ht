import { useEffect } from "react";

const useImportScript = (resourceUrl) => {

  console.log("loading script");
  useEffect(() => {
    const script = document.createElement("script");
    script.src = resourceUrl;
    script.async = true;
    document.body.appendChild(script);  

    return () => {
      document.body.removeChild(script);
    };
  }, [resourceUrl]);
};
export default useImportScript;
