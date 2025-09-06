// "use client";

// import { UserDetailContext } from "@/context/userDetailContext";
// import { supabase } from "@/services/supabaseClient";
// import React, { useContext, useEffect, useState } from "react";

// function Provider({ children }) {
//     const [user,setUser] = useState();
//     useEffect(() => {
//         CreateNewUser();
//     }, []);
//     const CreateNewUser = () => {
//         supabase.auth.getUser().then(async ({ data: { user } }) => {
//             // check if user already exist
//             let { data: users, error } = await supabase
//                 .from("users")
//                 .select("*")
//                 .eq("email", user?.email);
//             console.log(users);

//             // if not then create user
//             if (users?.length==0){
//                 const {data,error} = await supabase.from("users")
//                 .insert([
//                     {
//                         name:user?.user_metadata?.name,
//                         email:user?.email,
//                         picture:user?.user_metadata?.picture
//                     }
//                 ])
//                 console.log(data);
//                 if (error) console.error(error)
//                 setUser(data)
//                 return;
//             }
            
//             setUser(users[0])
//         });
//     };
//     return (
//         <UserDetailContext.Provider value={{user,setUser}}>
//             <div>{children}</div>
//         </UserDetailContext.Provider>
//     );
// }

// export default Provider;

// export const useUser=()=>{
//     const context  = useContext(UserDetailContext);
//     return context;
// }

"use client";

import { UserDetailContext } from "@/context/UserDetailContext";
import { supabase } from "@/services/supabaseClient";
import React, { useContext, useEffect, useState } from "react";

function Provider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    CreateNewUser();
  }, []);

  const CreateNewUser = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return;

    // check if user already exists
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.email);

    if (error) {
      console.error("Error fetching users:", error);
      return;
    }

    if (!users || users.length === 0) {
      // fallback to Google fields
      const { data: inserted, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            name: user.user_metadata?.full_name || user.user_metadata?.name || "",
            email: user.email,
            picture:
              user.user_metadata?.avatar_url ||
              user.user_metadata?.picture ||
              ""
          }
        ])
        .select(); // return inserted row

      if (insertError) {
        console.error("Error inserting user:", insertError);
        return;
      }

      setUser(inserted[0]);
      return;
    }

    setUser(users[0]);
  };

  return (
    <UserDetailContext.Provider value={{ user, setUser }}>
      <div>{children}</div>
    </UserDetailContext.Provider>
  );
}

export default Provider;

export const useUser = () => {
  const context = useContext(UserDetailContext);
  return context;
};
