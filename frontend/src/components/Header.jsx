import React from "react";
import createButton from "./CreateButton";
const Header = (title, onClick) => {
  return (
    <section className="bg-white py-[70px] dark:bg-dark">
      <div className="mx-auto px-4 sm:container">
        <div className="items-center justify-between border-b border-stroke dark:border-dark-3 md:flex">
          <div className="mb-6 w-full">
            <h2 className="mb-2 text-2xl font-semibold text-dark dark:text-white">
              {title}
            </h2>
          </div>
          <div className="mb-6">
            <createButton {}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
