import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import getImages from './services/imageAPI';

import { Searchbar } from './Components/Searchbar/Searchbar';
import { Spiner } from './Components/Loader/Spiner';
import { ImageGallery } from './Components/ImageGallery/ImageGallery';
import { Button } from './Components/Button/Button';
import { Modal } from './Components/Modal/Modal';

import { Container } from './App.styles';

const App = () => {
    const [page, setPage] = useState(1);
    const [images, setImages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [largeImage, setLargeImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!searchQuery) {
            return;
        }
        fetchImages();
    }, [searchQuery]);

    const handleFormSubmit = searchQuery => {
        setSearchQuery(searchQuery.trim());
        setPage(1);
        setImages([]);
    };

    const fetchImages = () => {
        setIsLoading(true);

        getImages(searchQuery, page)
            .then(hits => {
                setPage(page + 1);
                setImages([...images, ...hits]);
                setIsLoading(false);

                if (hits.length > 0) {
                    toast.success('We have a picture for you!', {
                        position: 'bottom-right',
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }

                if (hits.length === 0) {
                    toast.info('Picture is not found', {
                        position: 'bottom-right',
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }

                window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: 'smooth',
                });
            })
            .catch(error => {
                console.log(error);
                setIsLoading(false);

                toast.error('Error!', {
                    position: 'bottom-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
    };

    const openModal = largeImageURL => {
        setShowModal(true);
        setLargeImage(largeImageURL);
    };

    const toggleModal = () => {
        setShowModal(false);
        setLargeImage('');
    };

    return (
        <Container>
            <Searchbar onSubmit={handleFormSubmit} />

            {isLoading === true && <Spiner />}
            <>
                <ImageGallery images={images} openModal={openModal} />

                {images.length > 0 && <Button onClick={fetchImages} />}
            </>

            {showModal && (
                <Modal onClose={toggleModal}>
                    <img src={largeImage} alt="" />
                </Modal>
            )}
            <ToastContainer />
        </Container>
    );
};

export default App;