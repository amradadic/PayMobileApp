import UserLogin from "../src/scenes/userLogin";
import renderer from "react-test-renderer";



test("initial test", () => {
   // let data = renderer.create(<UserLogin/>).getInstance();
    let num=20;
    expect(num).toEqual(20);
  });