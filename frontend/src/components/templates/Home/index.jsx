import React from 'react';

// Components
import HeadingGeneral from '../../atoms/HeadingGeneral';
import HeaderPage from '../../organisms/HeaderPage';
import LoadWallet from '../../organisms/LoadWallet';
import {SectionHomepage, SectionSupport} from '../../organisms/HomeSections';

// Central style sheet for templates
import '../_settings/style.scss';

const TemplateHome = ({ account, recentWallets }) => {
    return (
        <div class="templatePage d-flex flex-column flex-grow-1">
            <div class="row">
                <div className="col-12">
                    <HeaderPage 
                        pageTitle={"Welcome to Greenfinch"} 
                        hasButton={false}/>
                    <div class="row">
                        <div class="col-6">
                            <div className="templateWrapper">
                                <div className="templateContainer">
                                    <SectionHomepage
                                        titleLevel={"h3"}
                                        sectionTitle={"Get started"} />
                                    <SectionSupport
                                        titleLevel={"h3"}
                                        sectionTitle={"Help and support"} />
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div className="templateWrapper">
                                <div className="templateContainer">
                                    <div className="d-flex">
                                        <div>
                                            <HeadingGeneral 
                                                level={"h3"}
                                                isUppercase={false}
                                                text={"Wallet management"} />
                                        </div>

                                        <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam interdum eleifend sem eu varius. Aliquam consequat odio libero, a facilisis sapien varius quis. Quisque ultricies purus elit, in posuere neque suscipit sit amet. Proin gravida ante et ipsum dapibus, nec cursus tortor dictum. Nam nec risus bibendum, lacinia ante in, lacinia enim. Proin semper augue vel mauris mattis luctus eget sit amet nibh. Curabitur venenatis nisi et leo rutrum, vitae porttitor dui laoreet. Nullam vel massa vel enim consequat tincidunt ornare sed enim.

Nullam risus turpis, ornare vel sem quis, rutrum accumsan nibh. Cras nunc purus, fringilla eu tincidunt quis, fringilla eget nunc. Phasellus eleifend justo neque, condimentum rhoncus metus vestibulum ac. Phasellus at nulla eget orci blandit lobortis vel quis felis. Curabitur dapibus tristique vestibulum. Fusce volutpat eros at mattis porta. Curabitur sodales neque quis porttitor vestibulum. Nam convallis fringilla pellentesque. Nunc ac venenatis felis, sed imperdiet sapien. Sed at rutrum odio. Vestibulum tempus tempor enim vitae posuere. Mauris enim augue, ultricies eu dapibus nec, tincidunt eget nulla. Suspendisse at felis nisl. In non turpis quis leo suscipit maximus. Curabitur eget eros odio. Quisque luctus, dolor quis auctor aliquam, mi risus pharetra quam, id maximus elit nibh dictum neque.

Maecenas iaculis, ligula non sollicitudin cursus, erat ligula ultrices ligula, sed mollis lacus est sed sem. Duis tincidunt non lacus eu dictum. Duis feugiat vulputate eros, in luctus diam efficitur nec. Suspendisse at pulvinar leo. Morbi sit amet dignissim metus. Nunc nulla justo, luctus facilisis vehicula in, imperdiet sit amet nunc. Nulla imperdiet maximus justo sed malesuada. Vestibulum non ultricies diam, ac tempus quam. Suspendisse pretium velit erat, et feugiat quam accumsan ut. Duis ut ornare velit. Ut iaculis lacus in neque ultricies, a sollicitudin turpis semper. Aenean vel lobortis ipsum. Vestibulum sit amet varius est, eget mollis risus.

Mauris eleifend elit ac dignissim elementum. Donec leo neque, scelerisque ac sapien at, facilisis blandit metus. Mauris commodo risus nisi, nec fermentum dolor dictum non. Fusce mattis dui nec augue sagittis elementum. Proin rutrum nisl eros, et accumsan nisl tristique vitae. Cras ac commodo justo. Pellentesque mattis, massa vel elementum euismod, arcu lorem maximus magna, non hendrerit nulla turpis sed erat. Integer condimentum dapibus euismod. Aenean quis dui dolor. Fusce ultrices, metus sed tristique vehicula, ligula tortor tempor diam, vitae dictum metus neque id augue. Nullam orci enim, placerat dignissim euismod quis, facilisis et orci. Maecenas tincidunt consequat leo maximus aliquam. Mauris tempor justo sit amet dolor rutrum gravida. Integer feugiat diam at diam vehicula interdum. Phasellus bibendum sapien dolor.

Aenean eget cursus dolor. Praesent rutrum nunc sed nisl gravida mattis. Curabitur tincidunt porttitor iaculis. Praesent et enim convallis, condimentum ante scelerisque, pellentesque nisl. Donec dictum feugiat sem nec malesuada. Donec id ullamcorper odio, nec vehicula sem. Aenean a semper magna, ut mattis justo. Nam rutrum maximus libero, ac elementum augue volutpat at. Sed nisl ipsum, suscipit id elit vel, mattis mattis lacus. Nulla a dolor id nibh lacinia mollis non eget dolor.
                                        </p>
                                        {/*
                                            <div className="ms-auto">
                                                <ButtonText 
                                                    type={"Default"}
                                                    size={"small"}
                                                    text={"Add new wallet"}
                                                    disabled={true}
                                                    hasIcon={false} />
                                            </div>
                                        */}
                                    </div>   
                                    <LoadWallet
                                        account={account}
                                        recentWallets={recentWallets}/>
                                </div>
                            </div>
                        </div>
                    </div>
                        
                </div>
            </div>
        </div>
    );
}

export default TemplateHome;
