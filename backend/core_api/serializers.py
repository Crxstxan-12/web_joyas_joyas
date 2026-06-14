from django.db import models, transaction
from rest_framework import serializers
from .models import Category, Product, Order, OrderItem


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock', 'image', 'category', 'category_name']


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'price', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'full_name', 'email', 'phone', 'address', 'total_amount', 'status', 'items', 'created_at']
        read_only_fields = ['total_amount', 'status']

    def create(self, validated_data):
        items_data = validated_data.pop('items')

        # Validate stock and recalculate prices from DB — never trust client prices
        total = 0
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']
            if product.stock < quantity:
                raise serializers.ValidationError({
                    'items': f'Stock insuficiente para "{product.name}". Disponible: {product.stock}.'
                })
            item_data['price'] = product.price
            total += product.price * quantity

        validated_data['total_amount'] = total

        with transaction.atomic():
            order = Order.objects.create(**validated_data)
            for item_data in items_data:
                product = item_data['product']
                quantity = item_data['quantity']
                OrderItem.objects.create(order=order, **item_data)
                # Atomic stock decrement
                Product.objects.filter(pk=product.pk).update(
                    stock=models.F('stock') - quantity
                )

        return order
