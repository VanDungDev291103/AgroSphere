package com.agricultural.agricultural.mapper;

import com.agricultural.agricultural.dto.CartDTO;
import com.agricultural.agricultural.dto.CartItemDTO;
import com.agricultural.agricultural.entity.Cart;
import com.agricultural.agricultural.entity.CartItem;
import com.agricultural.agricultural.entity.MarketPlace;
import com.agricultural.agricultural.entity.ProductVariant;
import com.agricultural.agricultural.entity.User;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-02T16:00:13+0700",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.12.1.jar, environment: Java 23.0.2 (Oracle Corporation)"
)
@Component
public class CartMapperImpl implements CartMapper {

    @Override
    public CartDTO toDTO(Cart cart) {
        if ( cart == null ) {
            return null;
        }

        CartDTO.CartDTOBuilder cartDTO = CartDTO.builder();

        cartDTO.userId( cartUserId( cart ) );
        cartDTO.userName( cartUserUsername( cart ) );
        cartDTO.id( cart.getId() );
        cartDTO.totalItems( cart.getTotalItems() );
        cartDTO.subtotal( cart.getSubtotal() );
        cartDTO.createdAt( cart.getCreatedAt() );
        cartDTO.updatedAt( cart.getUpdatedAt() );
        cartDTO.cartItems( toCartItemDTOList( cart.getCartItems() ) );

        return cartDTO.build();
    }

    @Override
    public Cart toEntity(CartDTO cartDTO) {
        if ( cartDTO == null ) {
            return null;
        }

        Cart.CartBuilder cart = Cart.builder();

        cart.id( cartDTO.getId() );
        cart.totalItems( cartDTO.getTotalItems() );
        cart.subtotal( cartDTO.getSubtotal() );
        cart.createdAt( cartDTO.getCreatedAt() );
        cart.updatedAt( cartDTO.getUpdatedAt() );
        cart.cartItems( cartItemDTOListToCartItemList( cartDTO.getCartItems() ) );

        cart.deleted( false );

        return cart.build();
    }

    @Override
    public List<CartDTO> toDTOList(List<Cart> carts) {
        if ( carts == null ) {
            return null;
        }

        List<CartDTO> list = new ArrayList<CartDTO>( carts.size() );
        for ( Cart cart : carts ) {
            list.add( toDTO( cart ) );
        }

        return list;
    }

    @Override
    public CartItemDTO toDTO(CartItem cartItem) {
        if ( cartItem == null ) {
            return null;
        }

        CartItemDTO.CartItemDTOBuilder cartItemDTO = CartItemDTO.builder();

        cartItemDTO.cartId( cartItemCartId( cartItem ) );
        cartItemDTO.productId( cartItemProductId( cartItem ) );
        cartItemDTO.productName( cartItemProductProductName( cartItem ) );
        cartItemDTO.productImage( cartItemProductImageUrl( cartItem ) );
        cartItemDTO.shortDescription( cartItemProductShortDescription( cartItem ) );
        cartItemDTO.originalPrice( cartItemProductPrice( cartItem ) );
        Integer quantity = cartItemProductQuantity( cartItem );
        if ( quantity != null ) {
            cartItemDTO.availableQuantity( quantity );
        }
        cartItemDTO.variantId( cartItemVariantId( cartItem ) );
        cartItemDTO.variantName( cartItemVariantName( cartItem ) );
        cartItemDTO.id( cartItem.getId() );
        cartItemDTO.quantity( cartItem.getQuantity() );
        cartItemDTO.unitPrice( cartItem.getUnitPrice() );
        cartItemDTO.notes( cartItem.getNotes() );
        cartItemDTO.addedAt( cartItem.getAddedAt() );
        cartItemDTO.updatedAt( cartItem.getUpdatedAt() );

        cartItemDTO.onSale( cartItem.getProduct().isOnSale() );
        cartItemDTO.discountAmount( cartItem.getProduct().getDiscountAmount() );
        cartItemDTO.totalPrice( cartItem.getTotalPrice() != null ? cartItem.getTotalPrice() : (cartItem.getUnitPrice() != null && cartItem.getQuantity() != null ? cartItem.getUnitPrice().multiply(new java.math.BigDecimal(cartItem.getQuantity())) : null) );

        return cartItemDTO.build();
    }

    @Override
    public CartItem toEntity(CartItemDTO cartItemDTO) {
        if ( cartItemDTO == null ) {
            return null;
        }

        CartItem.CartItemBuilder cartItem = CartItem.builder();

        cartItem.id( cartItemDTO.getId() );
        cartItem.quantity( cartItemDTO.getQuantity() );
        cartItem.unitPrice( cartItemDTO.getUnitPrice() );
        cartItem.totalPrice( cartItemDTO.getTotalPrice() );
        cartItem.discountAmount( cartItemDTO.getDiscountAmount() );
        cartItem.notes( cartItemDTO.getNotes() );
        cartItem.addedAt( cartItemDTO.getAddedAt() );
        cartItem.updatedAt( cartItemDTO.getUpdatedAt() );

        return cartItem.build();
    }

    @Override
    public List<CartItemDTO> toCartItemDTOList(List<CartItem> cartItems) {
        if ( cartItems == null ) {
            return null;
        }

        List<CartItemDTO> list = new ArrayList<CartItemDTO>( cartItems.size() );
        for ( CartItem cartItem : cartItems ) {
            list.add( toDTO( cartItem ) );
        }

        return list;
    }

    @Override
    public void updateCartFromDTO(CartDTO dto, Cart entity) {
        if ( dto == null ) {
            return;
        }

        entity.setId( dto.getId() );
        entity.setTotalItems( dto.getTotalItems() );
        entity.setSubtotal( dto.getSubtotal() );
        entity.setCreatedAt( dto.getCreatedAt() );
        entity.setUpdatedAt( dto.getUpdatedAt() );
        if ( entity.getCartItems() != null ) {
            List<CartItem> list = cartItemDTOListToCartItemList( dto.getCartItems() );
            if ( list != null ) {
                entity.getCartItems().clear();
                entity.getCartItems().addAll( list );
            }
            else {
                entity.setCartItems( null );
            }
        }
        else {
            List<CartItem> list = cartItemDTOListToCartItemList( dto.getCartItems() );
            if ( list != null ) {
                entity.setCartItems( list );
            }
        }
    }

    @Override
    public void updateCartItemFromDTO(CartItemDTO dto, CartItem entity) {
        if ( dto == null ) {
            return;
        }

        entity.setId( dto.getId() );
        entity.setQuantity( dto.getQuantity() );
        entity.setUnitPrice( dto.getUnitPrice() );
        entity.setTotalPrice( dto.getTotalPrice() );
        entity.setDiscountAmount( dto.getDiscountAmount() );
        entity.setNotes( dto.getNotes() );
        entity.setAddedAt( dto.getAddedAt() );
        entity.setUpdatedAt( dto.getUpdatedAt() );
    }

    private Integer cartUserId(Cart cart) {
        if ( cart == null ) {
            return null;
        }
        User user = cart.getUser();
        if ( user == null ) {
            return null;
        }
        int id = user.getId();
        return id;
    }

    private String cartUserUsername(Cart cart) {
        if ( cart == null ) {
            return null;
        }
        User user = cart.getUser();
        if ( user == null ) {
            return null;
        }
        String username = user.getUsername();
        if ( username == null ) {
            return null;
        }
        return username;
    }

    protected List<CartItem> cartItemDTOListToCartItemList(List<CartItemDTO> list) {
        if ( list == null ) {
            return null;
        }

        List<CartItem> list1 = new ArrayList<CartItem>( list.size() );
        for ( CartItemDTO cartItemDTO : list ) {
            list1.add( toEntity( cartItemDTO ) );
        }

        return list1;
    }

    private Integer cartItemCartId(CartItem cartItem) {
        if ( cartItem == null ) {
            return null;
        }
        Cart cart = cartItem.getCart();
        if ( cart == null ) {
            return null;
        }
        Integer id = cart.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private Integer cartItemProductId(CartItem cartItem) {
        if ( cartItem == null ) {
            return null;
        }
        MarketPlace product = cartItem.getProduct();
        if ( product == null ) {
            return null;
        }
        Integer id = product.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String cartItemProductProductName(CartItem cartItem) {
        if ( cartItem == null ) {
            return null;
        }
        MarketPlace product = cartItem.getProduct();
        if ( product == null ) {
            return null;
        }
        String productName = product.getProductName();
        if ( productName == null ) {
            return null;
        }
        return productName;
    }

    private String cartItemProductImageUrl(CartItem cartItem) {
        if ( cartItem == null ) {
            return null;
        }
        MarketPlace product = cartItem.getProduct();
        if ( product == null ) {
            return null;
        }
        String imageUrl = product.getImageUrl();
        if ( imageUrl == null ) {
            return null;
        }
        return imageUrl;
    }

    private String cartItemProductShortDescription(CartItem cartItem) {
        if ( cartItem == null ) {
            return null;
        }
        MarketPlace product = cartItem.getProduct();
        if ( product == null ) {
            return null;
        }
        String shortDescription = product.getShortDescription();
        if ( shortDescription == null ) {
            return null;
        }
        return shortDescription;
    }

    private BigDecimal cartItemProductPrice(CartItem cartItem) {
        if ( cartItem == null ) {
            return null;
        }
        MarketPlace product = cartItem.getProduct();
        if ( product == null ) {
            return null;
        }
        BigDecimal price = product.getPrice();
        if ( price == null ) {
            return null;
        }
        return price;
    }

    private Integer cartItemProductQuantity(CartItem cartItem) {
        if ( cartItem == null ) {
            return null;
        }
        MarketPlace product = cartItem.getProduct();
        if ( product == null ) {
            return null;
        }
        Integer quantity = product.getQuantity();
        if ( quantity == null ) {
            return null;
        }
        return quantity;
    }

    private Integer cartItemVariantId(CartItem cartItem) {
        if ( cartItem == null ) {
            return null;
        }
        ProductVariant variant = cartItem.getVariant();
        if ( variant == null ) {
            return null;
        }
        Integer id = variant.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String cartItemVariantName(CartItem cartItem) {
        if ( cartItem == null ) {
            return null;
        }
        ProductVariant variant = cartItem.getVariant();
        if ( variant == null ) {
            return null;
        }
        String name = variant.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
