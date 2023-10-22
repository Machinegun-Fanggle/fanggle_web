const NaverCircle = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={48}
    height={48}
    fill="none"
    {...props}
  >
    <rect width={48} height={48} fill="#50D030" rx={24} />
    <path
      fill="#fff"
      d="M29.976 30.5H27.18l-4.729-6.873h-.088V30.5h-3.34V17.773h2.848l4.658 6.838h.106v-6.838h3.34V30.5Z"
    />
  </svg>
);

export default NaverCircle;
