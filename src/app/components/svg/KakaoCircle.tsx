const KakaoCircle = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={48}
    height={48}
    fill="none"
    {...props}
  >
    <rect width={48} height={48} fill="#FFC700" rx={24} />
    <path
      fill="#353535"
      d="M19.148 17.773h3.34v5.204h.175l3.938-5.204h3.92l-4.36 5.678 4.447 7.049h-4.007l-2.936-4.834-1.178 1.512V30.5h-3.34V17.773Z"
    />
  </svg>
);
export default KakaoCircle;
